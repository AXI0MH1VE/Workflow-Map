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
  projects: string[]; // project IDs
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  notes: string;
  status: 'active' | 'archived';
  lastUpdated: string;
}

export interface WorkspaceState {
  categories: Category[];
  projects: Project[];
  activeProjectId: string | null;
  activeCategoryId: string | null;
}
