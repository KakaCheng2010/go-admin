import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { useDictStore } from '../store/dictStore';
import { authService, LoginRequest } from '../services/auth';
import { useMenuStore } from '../store/menuStore';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { setMenus } = useMenuStore();
  const { loadAllDicts } = useDictStore();

  const onLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      login(response.token, response.user);
      if (response.menus && Array.isArray(response.menus)) {
        setMenus(response.menus as any);
      }
      
      // 登录成功后加载字典数据
      try {
        await loadAllDicts();
      } catch (dictError) {
        console.warn('加载字典数据失败:', dictError);
        // 字典加载失败不影响登录流程
      }
      
      message.success('登录成功');
    } catch (error: any) {
      message.error(error.response?.data?.error || '登录失败');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card
        title="siqian-admin 管理系统"
        style={{ width: 400 }}
        styles={{
          header: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }
        }}
      >
        <Form
          name="login"
          onFinish={onLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
