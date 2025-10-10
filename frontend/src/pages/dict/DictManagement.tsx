import React from 'react';
import { Card, Table, Button, Space, Tag, Tabs } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const DictManagement: React.FC = () => {
  const dicts = [
    {
      key: '1',
      id: 1,
      name: '用户状态',
      code: 'USER_STATUS',
      description: '用户状态字典',
      status: 1,
    },
    {
      key: '2',
      id: 2,
      name: '组织类型',
      code: 'ORG_TYPE',
      description: '组织类型字典',
      status: 1,
    },
  ];

  const dictItems = [
    {
      key: '1',
      id: 1,
      dict_id: 1,
      label: '正常',
      value: '1',
      sort: 1,
      status: 1,
    },
    {
      key: '2',
      id: 2,
      dict_id: 1,
      label: '禁用',
      value: '0',
      sort: 2,
      status: 1,
    },
  ];

  const dictColumns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字典编码',
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
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const itemColumns = [
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
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'dicts',
      label: '字典管理',
      children: (
        <Table
          columns={dictColumns}
          dataSource={dicts}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
    {
      key: 'items',
      label: '字典项管理',
      children: (
        <Table
          columns={itemColumns}
          dataSource={dictItems}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>字典管理</h2>
          <Space>
            <Button icon={<ReloadOutlined />}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新增字典
            </Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="dicts" items={tabItems} />
      </Card>
    </div>
  );
};

export default DictManagement;
