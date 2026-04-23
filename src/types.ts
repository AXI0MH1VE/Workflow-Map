import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'trigger' | 'decision' | 'storage' | 'asset' | 'system' | 'verification';

export interface ProofChain {
  hash: string;
  previousHash: string | null;
  timestamp: string;
  signature: string;
  deterministicLogic: string;
}

export interface EuclideanAuditProposal {
  id: string;
  proposerId: string;
  objective: string;
  criteria: string[];
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';
  submissionDate: string;
}

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error';
  proofChain?: ProofChain[];
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
  assuranceLevel: 'STANDARD' | 'HIGH_ASSURANCE' | 'MATHEMATICALLY_PROVEN';
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
  auditProposals: EuclideanAuditProposal[];
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
