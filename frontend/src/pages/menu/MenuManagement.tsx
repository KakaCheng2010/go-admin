import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select, TreeSelect } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { menuService, Menu, CreateMenuRequest, UpdateMenuRequest } from '../../services/menu';
import { useDict } from '../../hooks/useDict';

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [form] = Form.useForm();
  const { dictOptions: statusOptions, loading: statusLoading } = useDict('status');

  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenus();
      setMenus(convertListToTree(data));
    } catch (error) {
      message.error('加载菜单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleCreate = () => {
    setEditingMenu(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setModalVisible(true);
    form.setFieldsValue(menu);
  };

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenu(id);
      message.success('删除成功');
      loadMenus();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: CreateMenuRequest | UpdateMenuRequest) => {
    try {
      if (editingMenu) {
        await menuService.updateMenu(editingMenu.id, values);
        message.success('更新成功');
      } else {
        await menuService.createMenu(values as CreateMenuRequest);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadMenus();
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    }
  };

  // 将菜单转为 TreeSelect 所需结构
  const menusToTreeSelect = (list: Menu[]): any[] => {
    console.log('menusToTreeSelect', list);
    const map = new Map<string, any>();
    const roots: any[] = [];
    list.forEach((m) => {
      map.set(m.id, {
        id: m.id,
        name: m.name,
        children: [],
      });
    });
    list.forEach((m) => {
      const node = map.get(m.id);
      if (m.parent_id) {
        const parent = map.get(m.parent_id);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  };

  // 将平铺菜单列表转换为树（用于 Table 展示）
  const convertListToTree = (list: Menu[]): Menu[] => {
    const map = new Map<string, Menu & { children?: Menu[] }>();
    const roots: (Menu & { children?: Menu[] })[] = [];

    list.forEach((m) => {
      map.set(m.id, { ...m, children: [] });
    });

    list.forEach((m) => {
      const node = map.get(m.id)!;
      if (m.parent_id) {
        const parent = map.get(m.parent_id);
        if (parent) {
          parent.children!.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // 清理空 children 以避免渲染多余展开图标
    const clean = (nodes: (Menu & { children?: Menu[] })[]): Menu[] =>
      nodes.map((n) => {
        const x: any = { ...n };
        if (x.children && x.children.length > 0) {
          x.children = clean(x.children);
        } else {
          delete x.children;
        }
        return x as Menu;
      });

    return clean(roots);
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => (
        <Tag color={type === 1 ? 'blue' : 'green'}>
          {type === 1 ? '菜单' : '按钮'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a: Menu, b: Menu) => a.sort - b.sort,
      defaultSortOrder: 'ascend' as const,
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
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Menu) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title='编辑'
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title='删除'
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>菜单管理</h2>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadMenus}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增菜单
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={menus}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
        />
      </Card>

      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
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
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="菜单编码"
            rules={[{ required: true, message: '请输入菜单编码' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="parent_id" label="上级菜单">
            <TreeSelect
              allowClear
              showSearch
              treeDefaultExpandAll
              placeholder="请选择上级菜单（不选则为根菜单）"
              treeData={menusToTreeSelect(menus)}
              fieldNames={{ value: 'id', label: 'name', children: 'children' }}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="component"
            label="组件"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>菜单</Select.Option>
              <Select.Option value={2}>按钮</Select.Option>
            </Select>
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
                {editingMenu ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
