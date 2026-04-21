import { Node, Edge } from '@xyflow/react';

export type NodeType = 'trigger' | 'decision' | 'storage' | 'asset' | 'system';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error';
}

export type WorkflowNode = Node<WorkflowNodeData>;

export interface Category {
  id: string;
  name: string;
  description?: string;
  projects: string[]; // project IDs
  parentId?: string | null;
}

export interface DeploymentSpec {
  url: string;
  status: 'active' | 'revoked';
  token: string;
  lastDeployed: string;
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  notes: string;
  status: 'active' | 'archived' | 'deleted';
  lastUpdated: string;
  deployment?: DeploymentSpec;
}

export type ViewMode = 'MAT' | 'NOTES';

export interface WorkspaceState {
  categories: Category[];
  projects: Project[];
  activeProjectId: string | null;
  activeCategoryId: string | null;
  viewMode: ViewMode;
}
