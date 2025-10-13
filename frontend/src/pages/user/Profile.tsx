import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CameraOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { userService, Profile, UpdateProfileRequest, ChangePasswordRequest } from '../../services/user';


const ProfilePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [messageObj, setMessageObj] = useState({show: false,type: 'success', message: ''});


  useEffect(() => {
    if (messageObj.show) {
      console.log(messageObj.type);
      if (messageObj.type === 'success') {
        messageApi.success(messageObj.message);
      } else {
        console.log(messageObj.message);
        messageApi.error(messageObj.message);
      }
    }
  }, [messageObj]);

  // 加载用户资料
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      profileForm.setFieldsValue({
        username: data.username,
        email: data.email || '',
        phone: data.phone,
        real_name: data.real_name,
      })
    } catch (error: any) {
      setMessageObj({show: true, type: 'error', message: error.response?.data?.error || '加载资料失败'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // 更新个人资料
  const handleUpdateProfile = async (values: UpdateProfileRequest) => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(values);
      setProfile(response.user);
      console.log(response);
      setMessageObj({show: true, type: 'success', message: response.message});
    } catch (error: any) {
      setMessageObj({show: true, type: 'error', message: error.response?.data?.error || '更新失败'});
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    try {
      setLoading(true);
      // 只发送必要的字段到后端
      const requestData: ChangePasswordRequest = {
        old_password: values.old_password,
        new_password: values.new_password,
      };
      const response = await userService.changePassword(requestData)
      setMessageObj({show: true, type: response.code==200 ? 'success' : 'error', message: response.message});
      passwordForm.resetFields();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '密码修改失败';
      setMessageObj({show: true, type: 'error', message: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  // 上传头像
  const handleUploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      const response = await userService.uploadAvatar(file);
      setProfile(prev => prev ? { ...prev, avatar: response.avatar } : null);
    } catch (error: any) {
      setMessageObj({show: true, type: 'error', message: error.response?.data?.error || '头像上传失败'});
    } finally {
      setLoading(false);
    }
    return false; // 阻止默认上传行为
  };

  // 定义Tabs的items
  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          基本信息
        </span>
      ),
      children: (
        <div style={{ maxWidth: 600 }}>
          {/* 头像区域 */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar
              size={80}
              src={profile?.avatar}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <div>
              <Upload
                beforeUpload={handleUploadAvatar}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<CameraOutlined />} type="primary" ghost>
                  更换头像
                </Button>
              </Upload>
            </div>
          </div>
          {/* 基本信息表单 */}
          <Form
            form={profileForm}
            labelCol={{ span: 4 }}
            layout="horizontal"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              label="用户名"
              name="username"
              extra="用户名不可修改"
            >
              <Input
                disabled
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱"
              />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="请输入手机号"
              />
            </Form.Item>

            <Form.Item
              label="真实姓名"
              name="real_name"
              rules={[
                { required: true, message: '请输入真实姓名' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入真实姓名"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'password',
      label: (
        <span>
          <LockOutlined />
          修改密码
        </span>
      ),
      children: (
        <div style={{ maxWidth: 600 }}>
          <Form
            form={passwordForm}
            labelCol={{ span: 4 }}
            layout="horizontal"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="当前密码"
              name="old_password"
              rules={[
                { required: true, message: '请输入当前密码' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入当前密码"
              />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="new_password"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度至少6位' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
              />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirm_password"
              dependencies={['new_password']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入新密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <Card title="个人资料" size='small' loading={loading}>
      {contextHolder}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Card>
  );
};

export default ProfilePage;
