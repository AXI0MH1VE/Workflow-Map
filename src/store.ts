import { create } from 'zustand';
import type { WorkspaceState, Category, Project, WorkflowNode, ViewMode } from './types';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'CORE SYSTEMS', projects: ['proj-1', 'proj-2'] },
  { id: 'cat-2', name: 'UI INTERFACES', projects: ['proj-3'] },
];

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    categoryId: 'cat-1',
    name: 'AUTH SERVICE',
    description: 'Central identity management flow',
    nodes: [
      { id: '1', type: 'trigger', position: { x: 50, y: 50 }, data: { label: 'LOGIN ATTEMPT', type: 'trigger', config: { trigger: 'POST Request' } } },
      { id: '2', type: 'decision', position: { x: 300, y: 50 }, data: { label: 'VERIFY JWT', type: 'decision', config: { logic: 'RS256' } } },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }],
    notes: '# Auth Service Documentation\nThis system handles OAuth2 flows.',
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    categoryId: 'cat-1',
    name: 'DATABASE SYNC',
    description: 'Real-time PostgreSQL to Redis replication',
    nodes: [],
    edges: [],
    notes: '# DB Sync\nDetails about replication logic.',
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    categoryId: 'cat-2',
    name: 'CUSTOMER PORTAL',
    description: 'B2B frontend orchestration',
    nodes: [],
    edges: [],
    notes: '# Customer Portal\nManaged UI components.',
    status: 'active',
    lastUpdated: new Date().toISOString(),
  }
];

interface WorkspaceActions {
  setActiveProject: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addProject: (categoryId: string) => void;
  addNode: (type: WorkflowNode['type']) => void;
  updateNotes: (content: string) => void;
  deployProject: () => void;
  revokeDeployment: () => void;
  setShowDeploymentModal: (show: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions & { showDeploymentModal: boolean }>((set, get) => ({
  categories: initialCategories,
  projects: initialProjects,
  activeProjectId: initialProjects[0].id,
  activeCategoryId: initialCategories[0].id,
  viewMode: 'MAT',
  showDeploymentModal: false,

  setActiveProject: (id) => set({ activeProjectId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setShowDeploymentModal: (show) => set({ showDeploymentModal: show }),

  onNodesChange: (changes) => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === activeProjectId
          ? { ...p, nodes: applyNodeChanges(changes, p.nodes) as WorkflowNode[] }
          : p
      ),
    }));
  },

  onEdgesChange: (changes) => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === activeProjectId
          ? { ...p, edges: applyEdgeChanges(changes, p.edges) }
          : p
      ),
    }));
  },

  onConnect: (connection) => {
    const { activeProjectId } = get();
    if (!activeProjectId) return;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === activeProjectId
          ? { ...p, edges: addEdge(connection, p.edges) }
          : p
      ),
    }));
  },

  updateNotes: (content) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    set({
      projects: projects.map((p) =>
        p.id === activeProjectId ? { ...p, notes: content, lastUpdated: new Date().toISOString() } : p
      ),
    });
  },

  deployProject: () => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    set({
      showDeploymentModal: true,
      projects: projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              deployment: {
                url: `https://live-link.run/${p.id.slice(0, 8)}`,
                status: 'active',
                token: `jwt_${Math.random().toString(36).substr(2, 9)}`,
                lastDeployed: new Date().toISOString(),
              },
            }
          : p
      ),
    });
  },

  revokeDeployment: () => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    set({
      projects: projects.map((p) =>
        p.id === activeProjectId
          ? { ...p, deployment: p.deployment ? { ...p.deployment, status: 'revoked' } : undefined }
          : p
      ),
    });
  },

  addProject: (categoryId) => {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      categoryId,
      name: 'NEW PROJECT',
      description: 'Newly created workflow',
      nodes: [],
      edges: [],
      notes: '',
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };

    set((state) => ({
      projects: [...state.projects, newProject],
      categories: state.categories.map(c => 
        c.id === categoryId ? { ...c, projects: [...c.projects, newId] } : c
      ),
      activeProjectId: newId,
      viewMode: 'MAT'
    }));
  },

  addNode: (type) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;
    
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: { 
        label: `${type.toUpperCase()} NODE`, 
        type, 
        config: {} 
      },
    };

    set({
      projects: projects.map((p) =>
        p.id === activeProjectId ? { ...p, nodes: [...p.nodes, newNode] } : p
      ),
    });
  },
}));
