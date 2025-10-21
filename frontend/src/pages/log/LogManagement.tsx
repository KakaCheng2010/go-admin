import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Tag,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import {  AccessLogItem, AccessLogQuery,getAccessLogs,batchDeleteAccessLogs } from '../../services/log';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermission } from '../../utils/permission';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const LogManagement: React.FC = () => {
  const [logs, setLogs] = useState<AccessLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // 权限检查
  const canDelete = usePermission('log:delete');
  const canExport = usePermission('log:export');

  // 检查认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadLogs();
  }, [isAuthenticated, navigate]);

  // 加载日志数据
  const loadLogs = async (
    page = 1,
    pageSize = 10,
    searchParams?: AccessLogQuery,
  ) => {
    setLoading(true);
    try {
      const params: AccessLogQuery = {
        page,
        page_size: pageSize,
        ...searchParams,
      };
      
      const response = await getAccessLogs(params);
      setLogs(response.items);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.total,
      });
    } catch (error: any) {
      message.error('加载日志列表失败');
      console.error('加载日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索功能
  const handleSearch = (values: any) => {
    const searchParams: AccessLogQuery = {
      username: values.username,
      path: values.path,
      start_time: values.timeRange?.[0]?.toISOString(),
      end_time: values.timeRange?.[1]?.toISOString(),
    };
    setPagination(prev => ({ ...prev, current: 1 }));
    loadLogs(1, pagination.pageSize, searchParams);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadLogs(1, pagination.pageSize);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的日志');
      return;
    }
    
    try {
      await batchDeleteAccessLogs(selectedRowKeys as string[]);
      message.success(`成功删除 ${selectedRowKeys.length} 条日志`);
      setSelectedRowKeys([]);
      loadLogs(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('批量删除日志失败:', error);
      message.error(error.response?.data?.error || '批量删除失败');
    }
  };

  // 导出日志
  const handleExport = async () => {
    try {
      // 这里可以调用导出API，暂时使用提示
      message.info('导出功能开发中...');
    } catch (error) {
      message.error('导出失败');
    }
  };

  // 获取状态码颜色
  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'green';
    if (statusCode >= 300 && statusCode < 400) return 'blue';
    if (statusCode >= 400 && statusCode < 500) return 'orange';
    if (statusCode >= 500) return 'red';
    return 'default';
  };

  // 获取HTTP方法颜色
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'blue';
      case 'POST': return 'green';
      case 'PUT': return 'orange';
      case 'DELETE': return 'red';
      case 'PATCH': return 'purple';
      default: return 'default';
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
      width: 120,
      ellipsis: true,
    },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
      width: 300,
      ellipsis: true,
      render: (path: string) => (
        <span title={path}>{path}</span>
      ),
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => (
        <Tag color={getMethodColor(method)}>
          {method.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
    },
    {
      title: '状态码',
      dataIndex: 'status_code',
      key: 'status_code',
      width: 100,
      render: (statusCode: number) => (
        <Tag color={getStatusCodeColor(statusCode)}>
          {statusCode}
        </Tag>
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'latency_ms',
      key: 'latency_ms',
      width: 120,
      render: (latencyMs: number) => (
        <span>{latencyMs}ms</span>
      ),
    },
    {
      title: '用户代理',
      dataIndex: 'user_agent',
      key: 'user_agent',
      width: 200,
      ellipsis: true,
      render: (userAgent: string) => (
        <span title={userAgent}>{userAgent}</span>
      ),
    },
    {
      title: '访问时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  return (
    <div>
      <Card>
        {/* 查询区域 */}
        <div style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="username" label="用户名">
              <Input placeholder="请输入用户名" style={{ width: 150 }} />
            </Form.Item>
            
            <Form.Item name="path" label="请求路径">
              <Input placeholder="请输入请求路径" style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item name="timeRange" label="访问时间">
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
                style={{ width: 350 }}
              />
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

        {/* 操作栏 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            {canDelete && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
            {canExport && (
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            )}
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadLogs(pagination.current, pagination.pageSize)}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          rowSelection={canDelete ? {
            selectedRowKeys: selectedRowKeys,
            onChange: setSelectedRowKeys,
          } : undefined}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              loadLogs(page, pageSize);
            },
          }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
};

export default LogManagement;
