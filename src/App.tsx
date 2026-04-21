import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkspaceStore } from './store';
import { nodeTypes } from './components/CustomNodes';
import { Folder, FileText, Plus, Rocket, Shield, Activity, Database, Library } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { categories, projects, activeProjectId, setActiveProject, addProject } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'TOOLBOX'>('WORKSPACE');

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('WORKSPACE')}
          className="brute-btn" 
          style={{ flex: 1, border: 'none', color: activeTab === 'WORKSPACE' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
        >
          WORKSPACE
        </button>
        <button 
          onClick={() => setActiveTab('TOOLBOX')}
          className="brute-btn" 
          style={{ flex: 1, border: 'none', color: activeTab === 'TOOLBOX' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
        >
          TOOLBOX
        </button>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        {activeTab === 'WORKSPACE' ? (
          categories.map(cat => (
            <div key={cat.id} style={{ marginBottom: '24px' }}>
              <div className="category-item" style={{ fontWeight: 800 }}>
                <Folder size={16} />
                <span>{cat.name}</span>
                <Plus 
                  size={14} 
                  style={{ marginLeft: 'auto', cursor: 'pointer' }} 
                  onClick={() => addProject(cat.id)}
                />
              </div>
              {cat.projects.map(pid => {
                const project = projects.find(p => p.id === pid);
                if (!project) return null;
                return (
                  <div 
                    key={pid}
                    className={`project-item ${activeProjectId === pid ? 'active' : ''}`}
                    onClick={() => setActiveProject(pid)}
                  >
                    <FileText size={14} />
                    <span>{project.name}</span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}>Logic Elements</div>
            <div className="brute-btn" style={{ fontSize: '12px', justifyContent: 'flex-start' }}><Plus size={14} /> TRIGGER NODE</div>
            <div className="brute-btn" style={{ fontSize: '12px', justifyContent: 'flex-start' }}><Plus size={14} /> DECISION NODE</div>
            <div className="brute-btn" style={{ fontSize: '12px', justifyContent: 'flex-start' }}><Plus size={14} /> STORAGE NODE</div>
            <div className="brute-btn" style={{ fontSize: '12px', justifyContent: 'flex-start' }}><Plus size={14} /> ASSET NODE</div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={10} color="var(--accent-color)" /> SECURE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={10} color="var(--accent-color)" /> LIVE_LINK</div>
      </div>
    </aside>
  );
};

const Header = () => {
  const { projects, activeProjectId, categories } = useWorkspaceStore();
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontStyle: 'italic', opacity: 0.5 }}>/ {activeCategory?.name} /</div>
        <h2 style={{ fontSize: '20px' }}>{activeProject?.name || 'SELECT PROJECT'}</h2>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <span style={{ fontSize: '9px', color: 'var(--accent-color)', fontWeight: 800 }}>STABLE CONNECTION</span>
          <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>ID: {activeProjectId?.slice(0,8)}...</span>
        </div>
        <button className="brute-btn primary">
          <Rocket size={16} />
          <span>DEPLOY LIVE</span>
        </button>
      </div>
    </header>
  );
};

const PropertiesPanel = () => {
  const { projects, activeProjectId } = useWorkspaceStore();
  const project = projects.find(p => p.id === activeProjectId);

  return (
    <div className="properties-panel">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>INSPECTOR</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {project?.description}
        </p>
      </div>
      <div style={{ padding: '20px' }}>
         <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', display: 'block', marginBottom: '8px' }}>DEPLOYMENT STATUS</label>
            <div style={{ background: '#000', padding: '12px', border: '1px solid var(--border-color)', fontSize: '11px' }}>
               <div style={{ color: 'var(--accent-color)' }}>● ONLINE</div>
               <div style={{ color: 'var(--text-secondary)' }}>LAST_SYNC: {new Date().toLocaleTimeString()}</div>
            </div>
         </div>
         <div style={{ display: 'grid', gap: '8px' }}>
            <button className="brute-btn" style={{ fontSize: '10px' }}><Database size={12} /> SYNC DATABASE</button>
            <button className="brute-btn" style={{ fontSize: '10px' }}><Library size={12} /> EXPORT SCHEMA</button>
         </div>
      </div>
    </div>
  );
};

function App() {
  const { projects, activeProjectId, onNodesChange, onEdgesChange, onConnect } = useWorkspaceStore();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="canvas-container">
          <ReactFlow
            nodes={activeProject?.nodes || []}
            edges={activeProject?.edges || []}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            colorMode="dark"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </main>
      <PropertiesPanel />
    </div>
  );
}

export default App;
