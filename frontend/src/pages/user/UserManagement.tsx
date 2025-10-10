import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Tree,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { userService, User, CreateUserRequest, UpdateUserRequest } from '../../services/user';
import { organizationService, Organization } from '../../services/organization';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [orgTreeData, setOrgTreeData] = useState<any[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // 检查认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrganizations();
    loadUsers();
  }, [isAuthenticated, navigate]);

  // 加载组织树
  const loadOrganizations = async () => {
    try {
      const organizations = await organizationService.getOrganizations();
      setOrganizations(organizations);
      
      // 构建树形数据
      const treeData = buildOrgTree(organizations);
      setOrgTreeData(treeData);
    } catch (error: any) {
      message.error('加载组织列表失败');
    }
  };

  // 构建组织树形数据
  const buildOrgTree = (orgs: Organization[]): any[] => {
    const orgMap = new Map<number, any>();
    const rootOrgs: any[] = [];

    // 先创建所有节点
    orgs.forEach(org => {
      const node = {
        key: org.id.toString(),
        title: org.name,
        icon: <TeamOutlined />,
        children: [],
        data: org
      };
      orgMap.set(org.id, node);
    });

    // 构建树形结构
    orgs.forEach(org => {
      const node = orgMap.get(org.id)!;
      if (org.parent_id === 0 || !org.parent_id) {
        rootOrgs.push(node);
      } else {
        const parent = orgMap.get(org.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return rootOrgs;
  };

  const loadUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, pageSize, selectedOrgId || undefined);
      setUsers(response.users);
      setPagination({
        current: response.page,
        pageSize: response.page_size,
        total: response.total,
      });
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理组织树选择
  const handleOrgSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      if (key === '0') {
        // 选择"全部用户"
        setSelectedOrgId(null);
      } else {
        const orgId = parseInt(key);
        setSelectedOrgId(orgId);
      }
      setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
      loadUsers(1, pagination.pageSize);
    } else {
      setSelectedOrgId(null);
      setPagination(prev => ({ ...prev, current: 1 }));
      loadUsers(1, pagination.pageSize);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      message.success('删除成功');
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, values);
        message.success('更新成功');
      } else {
        await userService.createUser(values as CreateUserRequest);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
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
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        {/* 左侧组织树 */}
        <Col span={6}>
          <Card title="组织架构" size="small">
            <Tree
              showIcon
              defaultExpandAll
              selectedKeys={selectedOrgId ? [selectedOrgId.toString()] : ['0']}
              onSelect={handleOrgSelect}
              treeData={[
                {
                  key: '0',
                  title: '全部用户',
                  icon: <TeamOutlined />,
                },
                ...orgTreeData,
              ]}
            />
          </Card>
        </Col>

        {/* 右侧用户列表 */}
        <Col span={18}>
          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4} style={{ margin: 0 }}>
                用户管理
                {selectedOrgId && (
                  <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                    (组织: {organizations.find(org => org.id === selectedOrgId)?.name || '未知'})
                  </span>
                )}
              </Title>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => loadUsers(pagination.current, pagination.pageSize)}
                >
                  刷新
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  新增用户
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                onChange: (page, pageSize) => {
                  loadUsers(page, pageSize);
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
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
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="real_name"
            label="真实姓名"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
