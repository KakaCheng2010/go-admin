import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { useAuthStore } from '../store/authStore';

const { Title, Text, Paragraph } = Typography;

const Debug: React.FC = () => {
  const { isAuthenticated, user, token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="认证状态调试">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>认证状态</Title>
            <Text>已认证: {isAuthenticated ? '是' : '否'}</Text>
          </div>
          
          <div>
            <Title level={4}>用户信息</Title>
            <Paragraph>
              <Text>用户: {user ? JSON.stringify(user, null, 2) : 'null'}</Text>
            </Paragraph>
          </div>
          
          <div>
            <Title level={4}>Token信息</Title>
            <Paragraph>
              <Text>Token: {token ? `${token.substring(0, 50)}...` : 'null'}</Text>
            </Paragraph>
          </div>
          
          <div>
            <Button type="primary" danger onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Debug;
