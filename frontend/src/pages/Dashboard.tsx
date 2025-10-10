import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const statistics = [
    {
      title: '用户总数',
      value: 1234,
      icon: <UserOutlined />,
      color: '#1890ff',
    },
    {
      title: '组织数量',
      value: 56,
      icon: <TeamOutlined />,
      color: '#52c41a',
    },
    {
      title: '角色数量',
      value: 12,
      icon: <SafetyOutlined />,
      color: '#faad14',
    },
    {
      title: '菜单数量',
      value: 89,
      icon: <MenuOutlined />,
      color: '#f5222d',
    },
  ];

  const recentUsers = [
    {
      key: '1',
      username: 'admin',
      real_name: '管理员',
      email: 'admin@example.com',
      status: 1,
      created_at: '2024-01-01 10:00:00',
    },
    {
      key: '2',
      username: 'user1',
      real_name: '用户1',
      email: 'user1@example.com',
      status: 1,
      created_at: '2024-01-02 11:00:00',
    },
    {
      key: '3',
      username: 'user2',
      real_name: '用户2',
      email: 'user2@example.com',
      status: 0,
      created_at: '2024-01-03 12:00:00',
    },
  ];

  const userColumns = [
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
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="最近用户" extra={<a href="/users">查看全部</a>}>
            <Table
              dataSource={recentUsers}
              columns={userColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
