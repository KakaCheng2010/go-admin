import React, { useState, useEffect } from 'react';
import { Tree, Card, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { organizationService, Organization } from '../services/organization';

interface OrganizationTreeProps {
  /** 选中的组织ID */
  selectedOrgId?: string | null;
  /** 选择组织时的回调函数 */
  onSelect?: (orgId: string | null) => void;
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean;
  /** 卡片标题 */
  title?: string;
  /** 卡片大小 */
  size?: 'small' | 'default';
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  selectedOrgId,
  onSelect,
  defaultExpandAll = true,
  title = '组织架构',
  size = 'small',
  style,
}) => {
  const [orgTreeData, setOrgTreeData] = useState<any[]>([]);

  // 加载组织数据
  const loadOrganizations = async () => {
    try {
      const organizations = await organizationService.getOrganizations();
      
      // 构建树形数据
      const treeData = buildOrgTree(organizations);
      setOrgTreeData(treeData);
    } catch (error: any) {
      message.error('加载组织列表失败');
    }
  };

  // 构建组织树形数据
  const buildOrgTree = (orgs: Organization[]): any[] => {
    const orgMap = new Map<string, any>();
    const rootOrgs: any[] = [];

    // 先创建所有节点
    orgs.forEach(org => {
      const node = {
        key: org.id,
        title: org.name,
        icon: <TeamOutlined />,
        children: [],
        data: org
      };
      orgMap.set(org.id, node);
    });

    // 构建树形结构
    orgs.forEach(org => {
      const node = orgMap.get(org.id)!;
      if (!org.parent_id || org.parent_id === '0') {
        rootOrgs.push(node);
      } else {
        const parent = orgMap.get(org.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return rootOrgs;
  };

  // 处理组织树选择
  const handleOrgSelect = (selectedKeys: React.Key[]) => {
    console.log('selectedKeys', selectedKeys);
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      onSelect?.(key);
    }
  };


  // 组件挂载时加载数据
  useEffect(() => {
    loadOrganizations();
  }, []);

  // 构建树形数据
  const treeData = [
    ...orgTreeData,
  ];

  return (
    <Card title={title} size={size} style={style}>
      <Tree
        showIcon
        defaultExpandAll={defaultExpandAll}
        selectedKeys={selectedOrgId ? [selectedOrgId] :[]}
        onSelect={handleOrgSelect}
        treeData={treeData}
      />
    </Card>
  );
};

export default OrganizationTree;
