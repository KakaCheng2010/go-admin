import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select, Tree } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  LinkOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { roleService, Role, CreateRoleRequest, UpdateRoleRequest } from '../../services/role';
import { menuService, Menu } from '../../services/menu';
import UserSelector from '../../components/UserSelector';
import { useDict } from '../../hooks/useDict';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const { dictOptions: statusOptions, loading: statusLoading } = useDict('status');
  
  // 关联菜单相关状态
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuTreeData, setMenuTreeData] = useState<Menu[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<React.Key[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  // 分配用户相关状态
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUserKeys, setSelectedUserKeys] = useState<React.Key[]>([]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      message.error('加载角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // 加载菜单树数据
  const loadMenuTree = async () => {
    try {
      const data = await menuService.getMenuTree();
      setMenuTreeData(data);
    } catch (error) {
      message.error('加载菜单树失败');
    }
  };



  const handleCreate = () => {
    setEditingRole(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setModalVisible(true);
    form.setFieldsValue(role);
  };

  const handleDelete = async (id: number) => {
    try {
      await roleService.deleteRole(id);
      message.success('删除成功');
      loadRoles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: CreateRoleRequest | UpdateRoleRequest) => {
    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, values);
        message.success('更新成功');
      } else {
        await roleService.createRole(values as CreateRoleRequest);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadRoles();
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    }
  };

  // 处理关联菜单
  const handleAssignMenus = async (role: Role) => {
    setCurrentRole(role);
    setMenuModalVisible(true);
    await loadMenuTree();
    
    // 获取角色已关联的菜单
    try {
      const roleData = await roleService.getRole(role.id);
      const roleMenuIds = roleData.menus?.map(menu => menu.id.toString()) || [];
      setSelectedMenuKeys(roleMenuIds);
    } catch (error) {
      setSelectedMenuKeys([]);
    }
  };

  // 保存菜单关联
  const handleSaveMenuAssignment = async () => {
    if (!currentRole) return;
    
    try {
      // 直接发送字符串ID，让后端处理转换
      const menuIds = selectedMenuKeys.map(key => key as string);
      console.log('发送的菜单ID:', menuIds); // 调试日志
      await roleService.assignMenus(currentRole.id, menuIds);
      message.success('菜单关联成功');
      setMenuModalVisible(false);
      setCurrentRole(null);
      setSelectedMenuKeys([]);
    } catch (error: any) {
      message.error(error.response?.data?.error || '关联菜单失败');
    }
  };

  // 处理分配用户
  const handleAssignUsers = async (role: Role) => {
    setCurrentRole(role);
    setUserModalVisible(true);
    
    // 获取角色已分配的用户
    try {
      const roleData = await roleService.getRole(role.id);
      const roleUserIds = roleData.users?.map((user: any) => user.id.toString()) || [];
      setSelectedUserKeys(roleUserIds);
    } catch (error) {
      setSelectedUserKeys([]);
    }
  };


  // 保存用户分配
  const handleSaveUserAssignment = async (userIds: string[]) => {
    if (!currentRole) return;
    
    try {
      console.log('发送的用户ID:', userIds); // 调试日志
      await roleService.assignUsers(currentRole.id, userIds);
      message.success('用户分配成功');
      setUserModalVisible(false);
      setCurrentRole(null);
      setSelectedUserKeys([]);
    } catch (error: any) {
      message.error(error.response?.data?.error || '分配用户失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
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
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title='编辑'
          >
            
          </Button>
          <Button
            type="link"
            icon={<LinkOutlined />}
            onClick={() => handleAssignMenus(record)}
            title='关联菜单'
          >
          
          </Button>
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleAssignUsers(record)}
            title='分配用户'
          >
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title='删除'
          >
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>角色管理</h2>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadRoles}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增角色
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
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
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>

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
            initialValue="1"
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
                {editingRole ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 关联菜单对话框 */}
      <Modal
        title={`关联菜单 - ${currentRole?.name}`}
        open={menuModalVisible}
        onCancel={() => {
          setMenuModalVisible(false);
          setCurrentRole(null);
          setSelectedMenuKeys([]);
        }}
        onOk={handleSaveMenuAssignment}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Tree
          checkable
          checkedKeys={selectedMenuKeys}
          onCheck={(checkedKeys) => setSelectedMenuKeys(checkedKeys as React.Key[])}
          treeData={menuTreeData}
          fieldNames={{ title: 'name', key: 'id', children: 'children' }}
          defaultExpandAll
        />
      </Modal>

      {/* 分配用户对话框 */}
      <UserSelector
        visible={userModalVisible}
        title={`分配用户 - ${currentRole?.name}`}
        selectedUserKeys={selectedUserKeys}
        onCancel={() => {
          setUserModalVisible(false);
          setCurrentRole(null);
          setSelectedUserKeys([]);
        }}
        onOk={handleSaveUserAssignment}
      />
    </div>
  );
};

export default RoleManagement;
