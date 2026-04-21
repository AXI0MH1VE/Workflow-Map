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
  const { projects, activeProjectId, categories, viewMode, setViewMode, deployProject } = useWorkspaceStore();
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '12px' }}>{activeCategory?.name} /</div>
          <h2 style={{ fontSize: '20px' }}>{activeProject?.name || 'SELECT PROJECT'}</h2>
        </div>
        
        <div className="tab-group">
          <button 
            className={`tab-btn ${viewMode === 'MAT' ? 'active' : ''}`}
            onClick={() => setViewMode('MAT')}
          >
            WORKFLOW MAT
          </button>
          <button 
            className={`tab-btn ${viewMode === 'NOTES' ? 'active' : ''}`}
            onClick={() => setViewMode('NOTES')}
          >
            PROJECT NOTES
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="pulse-dot"></div>
            <span style={{ fontSize: '9px', color: 'var(--accent-color)', fontWeight: 800, letterSpacing: '1px' }}>LIVE LINKED SYSTEM</span>
          </div>
          <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>ID: {activeProjectId?.slice(0,8)}... [PROTO_V2]</span>
        </div>
        <button 
          className="brute-btn primary"
          onClick={() => deployProject()}
        >
          <Rocket size={16} />
          <span>DEPLOY LIVE</span>
        </button>
      </div>
    </header>
  );
};

const NotesView = () => {
  const { projects, activeProjectId, updateNotes } = useWorkspaceStore();
  const project = projects.find(p => p.id === activeProjectId);

  if (!project) return null;

  return (
    <div className="notes-container">
      <textarea
        className="notes-editor"
        value={project.notes}
        onChange={(e) => updateNotes(e.target.value)}
        placeholder="Enter project documentation and structured instructions here..."
      />
    </div>
  );
};

const PropertiesPanel = () => {
  const { projects, activeProjectId, revokeDeployment } = useWorkspaceStore();
  const project = projects.find(p => p.id === activeProjectId);

  return (
    <div className="properties-panel">
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>INSPECTOR</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {project?.description}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ fontSize: '10px', display: 'block', marginBottom: '12px', fontWeight: 800 }}>DEPLOYMENT TELEMETRY</label>
          <div style={{ background: '#000', padding: '16px', border: '1px solid var(--border-color)', fontSize: '11px' }}>
            {project?.deployment ? (
              <>
                <div style={{ color: project.deployment.status === 'active' ? 'var(--accent-color)' : 'var(--error)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {project.deployment.status.toUpperCase()}
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>URL: {project.deployment.url}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>TOKEN: {project.deployment.token}</div>
                
                {project.deployment.status === 'active' && (
                  <button 
                    className="brute-btn" 
                    style={{ marginTop: '16px', width: '100%', fontSize: '10px', borderColor: 'var(--error)', color: 'var(--error)' }}
                    onClick={() => revokeDeployment()}
                  >
                    KILL LIVE LINK
                  </button>
                )}
              </>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>NO ACTIVE DEPLOYMENT</div>
            )}
          </div>
        </div>

        <div>
           <label style={{ fontSize: '10px', display: 'block', marginBottom: '12px', fontWeight: 800 }}>OPERATIONAL CONTROLS</label>
           <div style={{ display: 'grid', gap: '8px' }}>
              <button className="brute-btn" style={{ fontSize: '10px' }}><Database size={12} /> SYNC DATABASE</button>
              <button className="brute-btn" style={{ fontSize: '10px' }}><Library size={12} /> EXPORT SCHEMA</button>
           </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', fontSize: '9px', color: 'var(--text-secondary)' }}>
        LAST_SYNCED: {project?.lastUpdated ? new Date(project.lastUpdated).toLocaleTimeString() : 'N/A'}
      </div>
    </div>
  );
};

function App() {
  const { projects, activeProjectId, onNodesChange, onEdgesChange, onConnect, viewMode } = useWorkspaceStore();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="canvas-container">
          {viewMode === 'MAT' ? (
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
          ) : (
            <NotesView />
          )}
        </div>
      </main>
      <PropertiesPanel />
    </div>
  );
}

export default App;
