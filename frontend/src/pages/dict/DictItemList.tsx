import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Popconfirm, Breadcrumb, Modal, Form, Input, InputNumber, Select } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { dictService, DictItem, Dict } from '../../services/dict';

const DictItemList: React.FC = () => {
  const [items, setItems] = useState<DictItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dict, setDict] = useState<Dict | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const { dictId } = useParams<{ dictId: string }>();
  const location = useLocation();

  // 获取字典信息
  useEffect(() => {
    if (location.state?.dict) {
      setDict(location.state.dict);
    } else if (dictId) {
      // 如果没有传递字典信息，通过API获取
      dictService.getDict(dictId).then(setDict).catch(() => {
        message.error('获取字典信息失败');
        navigate('/dict');
      });
    }
  }, [dictId, location.state, navigate]);

  // 加载字典项列表
  const loadItems = async () => {
    if (!dictId) return;
    
    setLoading(true);
    try {
      const data = await dictService.getDictItems(dictId);
      setItems(data);
    } catch (error) {
      message.error('加载字典项列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [dictId]);

  // 删除字典项
  const handleDelete = async (id: string) => {
    try {
      await dictService.deleteDictItem(id);
      message.success('删除成功');
      loadItems();
    } catch (error: any) {
      message.error(error.response?.data?.error || '删除失败');
    }
  };

  // 打开新增弹窗
  const openCreateModal = () => {
    form.resetFields();
    form.setFieldsValue({ status: 1, sort: 0 });
    setCreateVisible(true);
  };

  // 提交新增
  const handleCreate = async () => {
    if (!dictId) return;
    try {
      const values = await form.validateFields();
      await dictService.createDictItem({
        dict_id: dictId,
        label: values.label,
        value: values.value,
        sort: values.sort,
        status: values.status,
      });
      message.success('创建成功');
      setCreateVisible(false);
      loadItems();
    } catch (error: any) {
      if (error?.errorFields) return; // 表单校验错误
      message.error(error?.response?.data?.error || '创建失败');
    }
  };

  // 打开编辑弹窗
  const openEditModal = (item: DictItem) => {
    setEditingItem(item);
    editForm.setFieldsValue({
      label: item.label,
      value: item.value,
      sort: item.sort,
      status: item.status,
    });
    setEditVisible(true);
  };

  // 提交编辑
  const handleEdit = async () => {
    if (!editingItem || !dictId) return;
    try {
      const values = await editForm.validateFields();
      await dictService.updateDictItem(editingItem.id, {
        label: values.label,
        value: values.value,
        sort: values.sort,
        status: values.status,
      });
      message.success('更新成功');
      setEditVisible(false);
      setEditingItem(null);
      loadItems();
    } catch (error: any) {
      if (error?.errorFields) return; // 表单校验错误
      message.error(error?.response?.data?.error || '更新失败');
    }
  };

  const columns = [
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
      render: (_: any, record: DictItem) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)} title='编辑'>
            
          </Button>
          <Popconfirm
            title="确定要删除这个字典项吗？"
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
        <div style={{ marginBottom: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Button 
                type="link" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/dict')}
                style={{ padding: 0 }}
              >
                字典管理
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {dict ? `${dict.name} (${dict.code})` : '字典项管理'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>
            字典项管理
            {dict && (
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                - {dict.name}
              </span>
            )}
          </h2>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadItems}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              新增字典项
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={items}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title="新增字典项"
          open={createVisible}
          onCancel={() => setCreateVisible(false)}
          onOk={handleCreate}
          okText="创建"
          cancelText="取消"
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="label"
              label="标签"
              rules={[{ required: true, message: '请输入标签' }]}
            >
              <Input placeholder="例如：正常" />
            </Form.Item>
            <Form.Item
              name="value"
              label="值"
              rules={[{ required: true, message: '请输入值' }]}
            >
              <Input placeholder="例如：1" />
            </Form.Item>
            <Form.Item name="sort" label="排序" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select options={[{ label: '正常', value: 1 }, { label: '禁用', value: 0 }]} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="编辑字典项"
          open={editVisible}
          onCancel={() => {
            setEditVisible(false);
            setEditingItem(null);
          }}
          onOk={handleEdit}
          okText="更新"
          cancelText="取消"
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="label"
              label="标签"
              rules={[{ required: true, message: '请输入标签' }]}
            >
              <Input placeholder="例如：正常" />
            </Form.Item>
            <Form.Item
              name="value"
              label="值"
              rules={[{ required: true, message: '请输入值' }]}
            >
              <Input placeholder="例如：1" />
            </Form.Item>
            <Form.Item name="sort" label="排序">
              <InputNumber min={0} style={{ width: '100%' }} />
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

export default DictItemList;
