import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Popconfirm, Modal, Form, Input, Select } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { dictService, Dict, CreateDictRequest } from '../../services/dict';

const DictList: React.FC = () => {
  const [dicts, setDicts] = useState<Dict[]>([]);
  const [loading, setLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingDict, setEditingDict] = useState<Dict | null>(null);
  const [form] = Form.useForm<CreateDictRequest>();
  const [editForm] = Form.useForm<CreateDictRequest>();
  const navigate = useNavigate();

  // 加载字典列表
  const loadDicts = async () => {
    setLoading(true);
    try {
      const data = await dictService.getDicts();
      setDicts(data);
    } catch (error) {
      message.error('加载字典列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDicts();
  }, []);

  // 打开新增弹窗
  const openCreateModal = () => {
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setCreateVisible(true);
  };

  // 提交新增
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await dictService.createDict(values);
      message.success('创建成功');
      setCreateVisible(false);
      loadDicts();
    } catch (error: any) {
      if (error?.errorFields) return; // 表单校验错误
      message.error(error?.response?.data?.error || '创建失败');
    }
  };

  // 删除字典
  const handleDelete = async (id: string) => {
    try {
      await dictService.deleteDict(id);
      message.success('删除成功');
      loadDicts();
    } catch (error: any) {
      message.error(error.response?.data?.error || '删除失败');
    }
  };

  // 查看字典项
  const handleViewItems = (dict: Dict) => {
    navigate(`/dict/items/${dict.id}`, { state: { dict } });
  };

  // 打开编辑弹窗
  const openEditModal = (dict: Dict) => {
    setEditingDict(dict);
    editForm.setFieldsValue({
      name: dict.name,
      code: dict.code,
      description: dict.description,
      status: dict.status,
    });
    setEditVisible(true);
  };

  // 提交编辑
  const handleEdit = async () => {
    if (!editingDict) return;
    try {
      const values = await editForm.validateFields();
      await dictService.updateDict(editingDict.id, values);
      message.success('更新成功');
      setEditVisible(false);
      setEditingDict(null);
      loadDicts();
    } catch (error: any) {
      if (error?.errorFields) return; // 表单校验错误
      message.error(error?.response?.data?.error || '更新失败');
    }
  };

  const columns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Dict) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewItems(record)}
            title='字典项'
          >
            
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)} title='编辑'>
            
          </Button>
          <Popconfirm
            title="确定要删除这个字典吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} title='删除'>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadDicts}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              新增
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={dicts}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title="新增字典"
          open={createVisible}
          onCancel={() => setCreateVisible(false)}
          onOk={handleCreate}
          okText="创建"
          cancelText="取消"
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="字典名称"
              rules={[{ required: true, message: '请输入字典名称' }]}
            >
              <Input placeholder="例如：用户状态" />
            </Form.Item>
            <Form.Item
              name="code"
              label="字典编码"
              rules={[{ required: true, message: '请输入字典编码' }]}
            >
              <Input placeholder="例如：USER_STATUS" />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea placeholder="请输入描述" rows={3} />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select options={[{ label: '正常', value: 1 }, { label: '禁用', value: 0 }]} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="编辑字典"
          open={editVisible}
          onCancel={() => {
            setEditVisible(false);
            setEditingDict(null);
          }}
          onOk={handleEdit}
          okText="更新"
          cancelText="取消"
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="name"
              label="字典名称"
              rules={[{ required: true, message: '请输入字典名称' }]}
            >
              <Input placeholder="例如：用户状态" />
            </Form.Item>
            <Form.Item
              name="code"
              label="字典编码"
              rules={[{ required: true, message: '请输入字典编码' }]}
            >
              <Input placeholder="例如：USER_STATUS" />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea placeholder="请输入描述" rows={3} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select options={[{ label: '正常', value: 1 }, { label: '禁用', value: 0 }]} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default DictList;
