import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select, TreeSelect, Radio, Row, Col } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { menuService, Menu, CreateMenuRequest, UpdateMenuRequest } from '../../services/menu';
import { useDict } from '../../hooks/useDict';
import IconSelector from '../../components/IconSelector';
import IconDisplay from '../../components/IconDisplay';

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuList, setMenuList] = useState<Menu[]>([]); // 平铺的菜单列表，用于TreeSelect
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [form] = Form.useForm();
  const [menuType, setMenuType] = useState<number>(1); // 菜单类型状态
  const { dictOptions: statusOptions, loading: statusLoading } = useDict('status');

  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenus();
      setMenuList(data); // 保存平铺数据
      setMenus(convertListToTree(data)); // 保存树形数据用于表格显示
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
    setMenuType(1); // 默认选择菜单类型
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuType(menu.type); // 设置当前菜单的类型
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
    console.log('menusToTreeSelect input:', list);

    // 如果是编辑模式，过滤掉当前菜单及其子菜单，避免循环引用
    const filteredList = editingMenu
      ? list.filter(menu => {
        // 过滤掉当前编辑的菜单
        if (menu.id === editingMenu.id) return false;
        // 过滤掉当前菜单的所有子菜单
        const isChild = (menuId: string, parentId: string): boolean => {
          if (menuId === parentId) return true;
          const menu = list.find(m => m.id === menuId);
          if (!menu || !menu.parent_id) return false;
          return isChild(menu.parent_id, parentId);
        };
        return !isChild(menu.id, editingMenu.id);
      })
      : list;

    console.log('filteredList:', filteredList);

    const map = new Map<string, any>();
    const roots: any[] = [];

    // 创建所有节点
    filteredList.forEach((m) => {
      map.set(m.id, {
        value: m.id,
        title: m.name,
        children: [],
      });
    });

    // 构建树形结构
    filteredList.forEach((m) => {
      const node = map.get(m.id);
      if (m.parent_id && map.has(m.parent_id)) {
        const parent = map.get(m.parent_id);
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    console.log('TreeSelect result:', roots);
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
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: '前端路由',
      dataIndex: 'route',
      key: 'route',
      width: 120,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => {
        return <IconDisplay iconName={icon} showName={true} size={16} />;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => (
        <Tag color={type === 1 ? 'blue' : 'green'}>
          {type === 1 ? '菜单' : '操作'}
        </Tag>
      ),
    },
   
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 120,
    },
   
    // {
    //   title: '隐藏',
    //   dataIndex: 'hidden',
    //   key: 'hidden',
    //   width: 80,
    //   render: (hidden: boolean) => (
    //     <Tag color={hidden ? 'red' : 'green'}>
    //       {hidden ? '是' : '否'}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: '缓存',
    //   dataIndex: 'keep_alive',
    //   key: 'keep_alive',
    //   width: 80,
    //   render: (keepAlive: boolean) => (
    //     <Tag color={keepAlive ? 'blue' : 'default'}>
    //       {keepAlive ? '是' : '否'}
    //     </Tag>
    //   ),
    // },
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
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item name="parent_id" label="上级菜单">
                <TreeSelect
                  allowClear
                  showSearch
                  treeDefaultExpandAll
                  placeholder="请选择上级菜单（不选则为根菜单）"
                  treeData={menusToTreeSelect(menuList)}
                  fieldNames={{ value: 'value', label: 'title', children: 'children' }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            {/* 类型 */}
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                name="type"
                label="类型"
                initialValue={1}
              >
                <Radio.Group onChange={(e) => setMenuType(e.target.value)}>
                  <Radio value={1}>菜单</Radio>
                  <Radio value={2}>操作</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/* 排序 */}
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                name="sort"
                label="排序"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* 名称字段 - 根据类型显示不同标签 */}
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                name="name"
                label={menuType === 1 ? "菜单名称" : "操作名称"}
                rules={[{ required: true, message: menuType === 1 ? '请输入菜单名称' : '请输入操作名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>


            {/* 图标 - 只有菜单类型才显示 */}
            {menuType === 1 && (
              <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="icon"
                  label="菜单图标"
                >
                  <IconSelector />
                </Form.Item>
              </Col>
            )}



            {/* 前端路由 - 只有菜单类型才显示 */}
            {menuType === 1 && (
              <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="route"
                  label="前端路由"
                >
                  <Input placeholder="如：/user/list, /user/detail" />
                </Form.Item>
              </Col>
            )}

            {/* 组件路径 - 只有菜单类型才显示 */}
            {menuType === 1 && (
              <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="component"
                  label="组件路径"
                >
                  <Input placeholder="如：itsm/cmdb/resource/index" />
                </Form.Item>
              </Col>
            )}

            {/* 权限标识 */}
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                name="permission"
                label="权限标识"
              >
                <Input placeholder="如：user:list, user:create" />
              </Form.Item>
            </Col>




            {/* 状态 */}
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="1"
              >
                <Select loading={statusLoading} style={{ width: '100%' }}>
                  {statusOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>



            {/* 是否隐藏 - 只有菜单类型才显示 */}
            {menuType === 1 && (
              <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="hidden"
                  label="是否隐藏"
                  valuePropName="checked"
                >
                  <input type="checkbox" />
                </Form.Item>
              </Col>
            )}

            {/* 是否缓存 - 只有菜单类型才显示 */}
            {menuType === 1 && (
              <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item
                  name="keep_alive"
                  label="是否缓存"
                  valuePropName="checked"
                >
                  <input type="checkbox" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '16px' }}>
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
