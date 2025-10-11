import React, { useState } from 'react';
import { Input, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  SettingOutlined,
  BookOutlined,
  MonitorOutlined,
  BugOutlined,
  CodeOutlined,
  EditOutlined,
  CloudDownloadOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BuildOutlined,
  DragOutlined,
  FunctionOutlined,
  TableOutlined,
  CheckSquareOutlined,
  AlertOutlined,
  MailOutlined,
  ClearOutlined,
  CommentOutlined,
  AppstoreOutlined,
  FileOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  value, 
  onChange, 
  placeholder = "点击选择图标" 
}) => {
  const [iconSearchText, setIconSearchText] = useState<string>('');
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  // 图标数据
  const iconList = [
    { name: 'dashboard', icon: <DashboardOutlined />, label: 'DashboardOutlined' },
    { name: 'user', icon: <UserOutlined />, label: 'UserOutlined' },
    { name: 'team', icon: <TeamOutlined />, label: 'TeamOutlined' },
    { name: 'safety', icon: <SafetyOutlined />, label: 'SafetyOutlined' },
    { name: 'menu', icon: <MenuOutlined />, label: 'MenuOutlined' },
    { name: 'setting', icon: <SettingOutlined />, label: 'SettingOutlined' },
    { name: 'book', icon: <BookOutlined />, label: 'BookOutlined' },
    { name: 'monitor', icon: <MonitorOutlined />, label: 'MonitorOutlined' },
    { name: 'bug', icon: <BugOutlined />, label: 'BugOutlined' },
    { name: 'code', icon: <CodeOutlined />, label: 'CodeOutlined' },
    { name: 'edit', icon: <EditOutlined />, label: 'EditOutlined' },
    { name: 'download', icon: <CloudDownloadOutlined />, label: 'CloudDownloadOutlined' },
    { name: 'calendar', icon: <CalendarOutlined />, label: 'CalendarOutlined' },
    { name: 'document', icon: <FileTextOutlined />, label: 'FileTextOutlined' },
    { name: 'chart', icon: <BarChartOutlined />, label: 'BarChartOutlined' },
    { name: 'build', icon: <BuildOutlined />, label: 'BuildOutlined' },
    { name: 'drag', icon: <DragOutlined />, label: 'DragOutlined' },
    { name: 'education', icon: <FunctionOutlined />, label: 'FunctionOutlined' },
    { name: 'excel', icon: <TableOutlined />, label: 'TableOutlined' },
    { name: 'checkbox', icon: <CheckSquareOutlined />, label: 'CheckSquareOutlined' },
    { name: 'color', icon: <AlertOutlined />, label: 'AlertOutlined' },
    { name: 'email', icon: <MailOutlined />, label: 'MailOutlined' },
    { name: 'clipboard', icon: <ClearOutlined />, label: 'ClearOutlined' },
    { name: 'component', icon: <CommentOutlined />, label: 'CommentOutlined' },
    { name: 'appstore', icon: <AppstoreOutlined />, label: 'AppstoreOutlined' },
    { name: 'date-range', icon: <CalendarOutlined />, label: 'CalendarOutlined' },
    { name: 'file', icon: <FileOutlined />, label: 'FileOutlined' },
    { name: 'database', icon: <DatabaseOutlined />, label: 'DatabaseOutlined' },
    { name: 'experiment', icon: <ExperimentOutlined />, label: 'ExperimentOutlined' },
  ];

  // 过滤图标
  const filteredIcons = iconList.filter(icon => 
    icon.name.toLowerCase().includes(iconSearchText.toLowerCase()) ||
    icon.label.toLowerCase().includes(iconSearchText.toLowerCase())
  );

  // 选择图标
  const handleIconSelect = (iconName: string) => {
    onChange?.(iconName);
    setPopoverVisible(false); // 选择后关闭弹窗
  };

  // 获取当前选中的图标
  const selectedIcon = iconList.find(icon => icon.name === value);

  return (
    <Popover
      content={
        <div style={{ width: 400, maxHeight: 300, overflow: 'auto' }}>
          <div style={{ marginBottom: 12 }}>
            <Input
              placeholder="请输入图标名称"
              prefix={<SearchOutlined />}
              value={iconSearchText}
              onChange={(e) => setIconSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {filteredIcons.map((iconItem) => (
              <div
                key={iconItem.name}
                onClick={() => handleIconSelect(iconItem.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '4px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.backgroundColor = '#f0f8ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: '2px' }}>
                  {iconItem.icon}
                </div>
                <div style={{ fontSize: '10px', textAlign: 'center' }}>
                  {iconItem.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      title="选择图标"
      trigger="click"
      placement="bottomLeft"
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
    >
      <Input
        readOnly
        placeholder={placeholder}
        value={selectedIcon ? selectedIcon.name : ''}
        style={{ cursor: 'pointer' }}
        prefix={selectedIcon ? selectedIcon.icon : undefined}
        suffix={<SearchOutlined />}
      />
    </Popover>
  );
};

export default IconSelector;
