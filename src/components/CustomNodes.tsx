import { Handle, Position } from '@xyflow/react';
import type { WorkflowNodeData } from '../types';
import { Play, Settings, Database, Box, Cpu } from 'lucide-react';

const NodeWrapper = ({ data, selected, children, type }: { data: any, selected: boolean, children: any, type: string }) => {
  const icons = {
    trigger: <Play size={14} />,
    decision: <Settings size={14} />,
    storage: <Database size={14} />,
    asset: <Box size={14} />,
    system: <Cpu size={14} />,
  };

  return (
    <div className={`node-container ${selected ? 'selected' : ''} node-type-${type}`}>
      <div className="node-header">
        {icons[type as keyof typeof icons]}
        <span>{data.label}</span>
      </div>
      <div className="node-body">
        {children}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent-color)' }} />
      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent-color)' }} />
    </div>
  );
};

export const TriggerNode = ({ data, selected }: any) => (
  <NodeWrapper data={data} selected={selected} type="trigger">
    <div>Start condition: {data.config.trigger || 'Manual'}</div>
  </NodeWrapper>
);

export const DecisionNode = ({ data, selected }: any) => (
  <NodeWrapper data={data} selected={selected} type="decision">
    <div>Logic: {data.config.logic || 'Boolean'}</div>
  </NodeWrapper>
);

export const StorageNode = ({ data, selected }: any) => (
  <NodeWrapper data={data} selected={selected} type="storage">
    <div>Endpoint: {data.config.db || 'PostgreSQL'}</div>
  </NodeWrapper>
);

export const AssetNode = ({ data, selected }: any) => (
  <NodeWrapper data={data} selected={selected} type="asset">
    <div>Component: {data.config.asset || 'React UI'}</div>
  </NodeWrapper>
);

export const SystemNode = ({ data, selected }: any) => (
  <NodeWrapper data={data} selected={selected} type="system">
    <div>Service: {data.config.service || 'Internal'}</div>
  </NodeWrapper>
);

export const nodeTypes = {
  trigger: TriggerNode,
  decision: DecisionNode,
  storage: StorageNode,
  asset: AssetNode,
  system: SystemNode,
};
