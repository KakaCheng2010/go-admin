import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Form, Input, Button, Space, Table, Select } from 'antd';
import { userService, User } from '../services/user';
import { organizationService } from '../services/organization';
import OrganizationTree from './OrganizationTree';

interface UserSelectorProps {
  visible: boolean;
  title: string;
  selectedUserKeys: React.Key[];
  onCancel: () => void;
  onOk: (userIds: string[]) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  visible,
  title,
  selectedUserKeys,
  onCancel,
  onOk,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedOrgPath, setSelectedOrgPath] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchForm] = Form.useForm();
  const [currentSelectedKeys, setCurrentSelectedKeys] = useState<React.Key[]>(selectedUserKeys);

  // 加载组织数据
  const loadOrganizations = async () => {
    try {
      const orgs = await organizationService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error('加载组织列表失败:', error);
    }
  };

  // 加载用户数据
  const loadUsers = async (orgId?: string, orgPath?: string, searchParams?: any) => {
    try {
      console.log('加载用户数据，组织ID:', orgId, '组织路径:', orgPath, '搜索参数:', searchParams);
      // 使用organization_path参数进行查询，包含子组织
      const response = await userService.getUsers(1, 1000, undefined, orgPath, searchParams);
      setUsers(response.users);
      console.log('加载到的用户数量:', response.users.length);
      console.log('用户数据:', response.users);
    } catch (error) {
      console.error('加载用户列表失败:', error);
      setUsers([]);
    }
  };

  // 处理组织选择
  const handleOrgSelect = (orgId: string | null) => {
    const selectedOrg = organizations.find(org => org.id === orgId) || null;
    const nextPath = selectedOrg ? selectedOrg.path : null;

    setSelectedOrgId(orgId);
    setSelectedOrgPath(nextPath);
    
    loadUsers(orgId || undefined, nextPath || undefined);
    
    // 清空当前选择，因为组织变了
    setCurrentSelectedKeys([]);
  };

  // 处理用户搜索
  const handleUserSearch = (values: any) => {
    console.log('搜索参数:', values);
    // 过滤掉空值
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    console.log('过滤后的搜索参数:', filteredValues);
    loadUsers(selectedOrgId || undefined, selectedOrgPath || undefined, filteredValues);
  };

  // 重置用户搜索
  const handleUserSearchReset = () => {
    searchForm.resetFields();
    loadUsers(selectedOrgId || undefined, selectedOrgPath || undefined);
  };

  // 全选用户
  const handleSelectAll = () => {
    const allUserIds = users.map(user => user.id);
    setCurrentSelectedKeys(allUserIds);
  };

  // 清空选择
  const handleClearAll = () => {
    setCurrentSelectedKeys([]);
  };

  // 保存选择
  const handleSave = () => {
    onOk(currentSelectedKeys as string[]);
  };

  // 同步外部传入的选中状态
  useEffect(() => {
    setCurrentSelectedKeys(selectedUserKeys);
  }, [selectedUserKeys]);

  // 组件挂载时加载数据
  useEffect(() => {
    if (visible) {
      loadOrganizations();
      loadUsers();
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      width={1200}
      okText="保存"
      cancelText="取消"
    >
      <Row gutter={16}>
        {/* 左侧组织树 */}
        <Col span={6}>
            <OrganizationTree
              selectedOrgId={selectedOrgId}
              onSelect={handleOrgSelect}
              defaultExpandAll={true}
              size="small"
            />
         
        </Col>
        
        {/* 右侧用户列表 */}
        <Col span={18}>
          <Card title="用户列表" size="small">
            {/* 查询区 */}
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleUserSearch}
              style={{ marginBottom: 16 }}
            >
              <Form.Item name="username" label="账号">
                <Input placeholder="请输入账号" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                  <Select.Option value="1">正常</Select.Option>
                  <Select.Option value="0">禁用</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入手机号" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" size="small">
                    查询
                  </Button>
                  <Button onClick={handleUserSearchReset} size="small">
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {/* 用户选择按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                size="small"
                onClick={handleSelectAll}
              >
                全选
              </Button>
              <Button
                size="small"
                style={{ marginLeft: 8 }}
                onClick={handleClearAll}
              >
                清空
              </Button>
              <span style={{ marginLeft: 16, color: '#666' }}>
                已选择 {currentSelectedKeys.length} 个用户
              </span>
            </div>

            {/* 用户表格 */}
            <Table
              dataSource={users}
              rowKey="id"
              size="small"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              rowSelection={{
                selectedRowKeys: currentSelectedKeys,
                onChange: (selectedRowKeys) => {
                  setCurrentSelectedKeys(selectedRowKeys);
                },
                getCheckboxProps: (record) => ({
                  name: record.username,
                }),
              }}
              columns={[
                {
                  title: '账号',
                  dataIndex: 'username',
                  key: 'username',
                  width: 120,
                },
                {
                  title: '姓名',
                  dataIndex: 'real_name',
                  key: 'real_name',
                  width: 100,
                },
                {
                  title: '手机号',
                  dataIndex: 'phone',
                  key: 'phone',
                  width: 150,
                },
                {
                  title: '邮箱',
                  dataIndex: 'email',
                  key: 'email',
                  width: 200,
                  render: (email: string) => email || '-',
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 80,
                  render: (status: string) => (
                    <span style={{ color: status === '1' ? '#52c41a' : '#ff4d4f' }}>
                      {status === '1' ? '正常' : '禁用'}
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default UserSelector;
