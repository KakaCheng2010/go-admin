import React from 'react';
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

interface IconDisplayProps {
  iconName?: string;
  showName?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

const IconDisplay: React.FC<IconDisplayProps> = ({
  iconName,
  showName = false,
  size = 16,
  style = {}
}) => {
  // 图标映射
  const getIconComponent = (name: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'dashboard': <DashboardOutlined />,
      'user': <UserOutlined />,
      'team': <TeamOutlined />,
      'safety': <SafetyOutlined />,
      'menu': <MenuOutlined />,
      'setting': <SettingOutlined />,
      'book': <BookOutlined />,
      'monitor': <MonitorOutlined />,
      'bug': <BugOutlined />,
      'code': <CodeOutlined />,
      'edit': <EditOutlined />,
      'download': <CloudDownloadOutlined />,
      'calendar': <CalendarOutlined />,
      'document': <FileTextOutlined />,
      'chart': <BarChartOutlined />,
      'build': <BuildOutlined />,
      'drag': <DragOutlined />,
      'education': <FunctionOutlined />,
      'excel': <TableOutlined />,
      'checkbox': <CheckSquareOutlined />,
      'color': <AlertOutlined />,
      'email': <MailOutlined />,
      'clipboard': <ClearOutlined />,
      'component': <CommentOutlined />,
      'appstore': <AppstoreOutlined />,
      'date-range': <CalendarOutlined />,
      'file': <FileOutlined />,
      'database': <DatabaseOutlined />,
      'experiment': <ExperimentOutlined />,
    };
    return iconMap[name] || null;
  };

  if (!iconName) {
    return <span>-</span>;
  }

  const iconComponent = getIconComponent(iconName);

  if (!iconComponent) {
    return <span>{iconName}</span>;
  }

  const iconStyle = {
    fontSize: size,
    ...style
  };

  if (showName) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={iconStyle}>{iconComponent}</span>
        {/* <span>{iconName}</span> */}
      </div>
    );
  }

  return <span style={iconStyle}>{iconComponent}</span>;
};

export default IconDisplay;
