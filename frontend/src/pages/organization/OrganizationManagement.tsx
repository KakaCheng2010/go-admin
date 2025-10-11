import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Tag, 
  message, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select,
  Table,
  Typography,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { TreeSelect } from 'antd';
import { organizationService, Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../services/organization';
import { useDict } from '../../hooks/useDict';

const { Title } = Typography;

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Organization[]>([]);
  const { dictOptions: statusOptions, loading: statusLoading } = useDict('status');

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const data = await organizationService.getOrganizations();
      // 保存原始数据用于选择上级组织
      setAllOrganizations(data);
      // 将列表转换为树形结构
      const treeData = convertListToTree(data);
      setOrganizations(treeData);
    } catch (error) {
      message.error('加载组织列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 构建树形选择器数据
  const buildTreeSelectData = (list: Organization[]): any[] => {
    const map = new Map<number, any>();
    const roots: any[] = [];

    // 创建映射
    list.forEach(item => {
      map.set(parseInt(item.id), {
        title: item.name,
        value: item.id,
        key: item.id,
        children: []
      });
    });

    // 构建树形结构
    list.forEach(item => {
      const node = map.get(parseInt(item.id));
      if (!item.parent_id) {
        roots.push(node);
      } else {
        const parent = map.get(parseInt(item.parent_id));
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return roots;
  };

  // 将列表转换为树形结构
  const convertListToTree = (list: Organization[]): Organization[] => {
    const map = new Map<number, Organization & { children?: Organization[] }>();
    const roots: (Organization & { children?: Organization[] })[] = [];

    // 创建映射，深拷贝避免修改原始数据
    list.forEach(item => {
      map.set(parseInt(item.id), { ...item, children: [] });
    });

    // 构建树形结构
    list.forEach(item => {
      const node = map.get(parseInt(item.id))!;
      if (!item.parent_id) {
        // 根节点
        roots.push(node);
      } else {
        // 子节点
        const parent = map.get(parseInt(item.parent_id));
        if (parent) {
          parent.children!.push(node);
        }
      }
    });

    // 清理叶子节点（后端已按排序字段排序）
    const cleanTree = (nodes: (Organization & { children?: Organization[] })[]): Organization[] => {
      return nodes.map(node => {
        const cleanedNode = { ...node };
        
        if (node.children && node.children.length > 0) {
          // 有子节点，递归处理
          cleanedNode.children = cleanTree(node.children);
        } else {
          // 叶子节点，删除children字段
          delete cleanedNode.children;
        }
        return cleanedNode;
      });
    };

    const result = cleanTree(roots);
    
    // 调试输出
    console.log('原始列表:', list);
    console.log('转换后的树形结构:', result);
    
    return result;
  };


  useEffect(() => {
    loadOrganizations();
  }, []);


  // 添加根组织
  const handleCreate = () => {
    setEditingOrg(null);
    setModalVisible(true);
    form.resetFields();
  };


  // 处理行选择
  const handleRowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Organization[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的组织');
      return;
    }
    
    try {
      for (const org of selectedRows) {
        await organizationService.deleteOrganization(org.id);
      }
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      setSelectedRows([]);
      loadOrganizations();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setModalVisible(true);
    form.setFieldsValue(org);
  };

  const handleDelete = async (id: string) => {
    try {
      await organizationService.deleteOrganization(id);
      message.success('删除成功');
      loadOrganizations();
    } catch (error) {
      message.error('删除失败');
    }
  };


  const handleSubmit = async (values: CreateOrganizationRequest | UpdateOrganizationRequest) => {
    try {
      if (editingOrg) {
        await organizationService.updateOrganization(editingOrg.id, values);
        message.success('更新成功');
      } else {
        // 创建新组织时，使用表单中的parent_id
        const createData = {
          ...values,
          parent_id: values.parent_id || undefined
        } as CreateOrganizationRequest;
        await organizationService.createOrganization(createData);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadOrganizations();
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '组织名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Organization) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span style={{ fontWeight: !record.parent_id ? 'bold' : 'normal' }}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: '组织编码',
      dataIndex: 'code',
      key: 'code',
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
      render: (status: string) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return (
          <Tag color={status === '1' ? 'green' : 'red'}>
            {statusOption?.label || (status === '1' ? '启用' : '禁用')}
          </Tag>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Organization) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="确定要删除这个组织吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
     
        <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>组织管理</Title>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadOrganizations}
              loading={loading}
            >
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
            >
              新增
            </Button>
            {selectedRows.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRows.length} 个组织吗？`}
                onConfirm={handleBatchDelete}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                >
                  批量删除 ({selectedRows.length})
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={organizations}
          rowKey="id"
          loading={loading}
          pagination={false}
          rowSelection={handleRowSelection}
          expandable={{
            defaultExpandAllRows: true,
            childrenColumnName: 'children',
            indentSize: 20,
            expandRowByClick: false,
          }}
          size="middle"
          style={{ backgroundColor: '#fff' }}
          onRow={(record) => ({
            onDoubleClick: () => handleEdit(record),
          })}
        />
     

      <Modal
        title={editingOrg ? '编辑组织' : '新增组织'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="组织编码"
            rules={[{ required: true, message: '请输入组织编码' }]}
          >
            <Input />
          </Form.Item>

          {!editingOrg && (
            <Form.Item
              name="parent_id"
              label="上级组织"
            >
              <TreeSelect
                placeholder="请选择上级组织（不选择则为根组织）"
                allowClear
                showSearch
                treeDefaultExpandAll
                treeNodeFilterProp="title"
                filterTreeNode={(input, node) =>
                  String(node.title || '').toLowerCase().includes(input.toLowerCase())
                }
                treeData={buildTreeSelectData(allOrganizations)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}


          <Form.Item
            name="sort"
            label="排序"
            initialValue={0}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select loading={statusLoading}>
              {statusOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingOrg ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OrganizationManagement;
