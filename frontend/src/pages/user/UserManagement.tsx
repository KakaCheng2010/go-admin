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
  Upload,
  TreeSelect,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { userService, User, CreateUserRequest, UpdateUserRequest } from '../../services/user';
import { organizationService, Organization } from '../../services/organization';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import OrganizationTree from '../../components/OrganizationTree';
import { useDict } from '../../hooks/useDict';

 

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
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string | null>(null);
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { dictOptions: statusOptions, loading: statusLoading } = useDict('status');

  // 检查认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrganizations();
    loadUsers();
  }, [isAuthenticated, navigate]);

  // 监听组织选择变化，更新新增用户表单的默认组织
  // [] 里面的值发生变化就会触发
  useEffect(() => {
    if (modalVisible && !editingUser && selectedOrgId) {
      form.setFieldsValue({
        organization_id: selectedOrgId
      });
    }
  }, [selectedOrgId, modalVisible, editingUser, form]);

  // 加载组织数据（用于显示组织名称）
  const loadOrganizations = async () => {
    try {
      const organizations = await organizationService.getOrganizations();
      setOrganizations(organizations);
    } catch (error: any) {
      message.error('加载组织列表失败');
    }
  };

  // 构建组织树数据（用于TreeSelect）
  const buildOrgTreeData = (orgs: Organization[]): any[] => {
    const orgMap = new Map<string, any>();
    const rootOrgs: any[] = [];

    // 先创建所有节点
    orgs.forEach(org => {
      const node = {
        value: org.id,
        title: org.name,
        key: org.id,
        children: [],
        data: org
      };
      orgMap.set(org.id, node);
    });

    // 构建树形结构
    orgs.forEach(org => {
      const node = orgMap.get(org.id)!;
      if (!org.parent_id || org.parent_id === '0') {
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

  const loadUsers = async (
    page = 1,
    pageSize = 10,
    searchParams?: any,
    overrideOrgId?: string | null,
    overrideOrgPath?: string | null,
  ) => {
    setLoading(true);
    try {
      const effOrgId = overrideOrgId !== undefined ? overrideOrgId : selectedOrgId;
      const effOrgPath = overrideOrgPath !== undefined ? overrideOrgPath : selectedOrgPath;
      const orgId = effOrgId ? parseInt(effOrgId, 10) : undefined;
      const response = await userService.getUsers(
        page,
        pageSize,
        orgId,
        (effOrgPath || undefined),
        searchParams,
      );
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
  const handleOrgSelect = (orgId: string | null) => {
    const selectedOrg = organizations.find(org => org.id === orgId) || null;
    const nextPath = selectedOrg ? selectedOrg.path : null;

    setSelectedOrgId(orgId);
    setSelectedOrgPath(nextPath);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页

    // 立即使用本次选择的 orgId/path 覆盖，避免读到上一次的state
    loadUsers(1, pagination.pageSize, undefined, orgId, nextPath);
  };

  // 搜索功能
  const handleSearch = (values: any) => {
    const searchParams = {
      username: values.username,
      real_name: values.real_name,
      email: values.email,
      phone: values.phone,
      status: values.status,
      created_at_start: values.created_at?.[0]?.format('YYYY-MM-DD'),
      created_at_end: values.created_at?.[1]?.format('YYYY-MM-DD'),
    };
    setPagination(prev => ({ ...prev, current: 1 }));
    loadUsers(1, pagination.pageSize, searchParams);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadUsers(1, pagination.pageSize);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    try {
      await userService.batchDeleteUsers(selectedRowKeys as string[]);
      message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
      setSelectedRowKeys([]);
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('批量删除用户失败:', error);
      message.error(error.response?.data?.error || '批量删除失败');
    }
  };

  // 导入用户
  const handleImport = async (file: any) => {
    try {
      await userService.importUsers(file);
      message.success('导入成功');
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('导入失败');
    }
    return false; // 阻止默认上传行为
  };

  // 导出用户
  const handleExport = async () => {
    try {
      const blob = await userService.exportUsers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `用户列表_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalVisible(true);
    form.resetFields();
    
    // 设置默认的组织ID为当前选中的组织
    if (selectedOrgId) {
      form.setFieldsValue({
        organization_id: selectedOrgId
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      message.success('删除成功');
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('删除用户失败:', error);
      message.error(error.response?.data?.error || '删除失败');
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
      title: '序号',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      key: 'real_name',
      sorter: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return (
          <Tag color={status === '1' ? 'green' : 'red'}>
            {statusOption?.label || (status === '1' ? '正常' : '禁用')}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date: string) => {
        return new Date(date).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
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
        <Col span={5}>
          <OrganizationTree
            selectedOrgId={selectedOrgId}
            onSelect={handleOrgSelect}
            defaultExpandAll={true}
            title="组织架构"
            size="small"
          />
        </Col>

        {/* 右侧用户列表 */}
        <Col span={19}>
        <Card>
          <div>
            {/* 上部分：查询区域 */}
            <div style={{ marginBottom: 10 }}>
              <Form
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
                style={{ marginBottom: 16 }}
              >
                <Form.Item name="username" label="用户名">
                  <Input placeholder="请输入用户名" style={{ width: 150 }} />
                </Form.Item>
                
                <Form.Item name="phone" label="手机号">
                  <Input placeholder="请输入手机号" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" style={{ width: 120 }} allowClear loading={statusLoading}>
                    {statusOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>

            {/* 中部分：操作栏 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  新增
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量删除 ({selectedRowKeys.length})
                </Button>
                <Upload
                  accept=".xlsx,.xls"
                  beforeUpload={handleImport}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    导入
                  </Button>
                </Upload>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  导出
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => loadUsers(pagination.current, pagination.pageSize)}
                >
                  刷新
                </Button>
              </Space>
            </div>

            {/* 下部分：表格 */}
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
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
          </div>
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
            rules={[
              { type: 'email', message: '请输入有效的邮箱' },
              { required: false }
            ]}
          >
            <Input placeholder="请输入邮箱（可选）" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="organization_id"
            label="所属组织"
          >
            <TreeSelect
              placeholder="请选择所属组织"
              treeData={buildOrgTreeData(organizations)}
              treeDefaultExpandAll
              showSearch
              treeNodeFilterProp="title"
              allowClear
            />
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
