import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkspaceStore } from './store';
import { nodeTypes } from './components/CustomNodes';
import { Folder, FileText, Plus, Rocket, Shield, Activity, Database, Library } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { categories, projects, activeProjectId, setActiveProject, addProject } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'TOOLBOX'>('WORKSPACE');
  const [search, setSearch] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    projects: cat.projects.filter(pid => {
      const p = projects.find(proj => proj.id === pid);
      return p?.name.toLowerCase().includes(search.toLowerCase());
    })
  })).filter(cat => cat.projects.length > 0 || cat.name.toLowerCase().includes(search.toLowerCase()));

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

      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="SEARCH REGISTRY..." 
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', overflowY: 'auto', flex: 1 }}>
        {activeTab === 'WORKSPACE' ? (
          filteredCategories.map(cat => (
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
          <div style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '12px' }}>/ {activeCategory?.name} /</div>
          <h2 style={{ fontSize: '20px' }}>{activeProject?.name || 'SELECT PROJECT'}</h2>
        </div>
        
        <div className="tab-group" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <button 
            className="brute-btn"
            style={{ 
              border: 'none', 
              fontSize: '10px', 
              background: viewMode === 'MAT' ? 'var(--accent-color)' : 'transparent',
              color: viewMode === 'MAT' ? '#000' : 'var(--text-primary)'
            }}
            onClick={() => setViewMode('MAT')}
          >
            WORKFLOW MAT
          </button>
          <button 
            className="brute-btn"
            style={{ 
              border: 'none', 
              fontSize: '10px', 
              background: viewMode === 'NOTES' ? 'var(--accent-color)' : 'transparent',
              color: viewMode === 'NOTES' ? '#000' : 'var(--text-primary)'
            }}
            onClick={() => setViewMode('NOTES')}
          >
            DOCUMENTATION
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
        <button className="brute-btn primary" onClick={deployProject}>
          <Rocket size={16} />
          <span>DEPLOY LIVE</span>
        </button>
      </div>
    </header>
  );
};

const NotesEditor = () => {
  const { activeProjectId, projects, updateNotes } = useWorkspaceStore();
  const project = projects.find(p => p.id === activeProjectId);

  if (!project) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#080808' }}>
      <div style={{ padding: '40px 80px', maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1 }}>
        <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>{project.name}</h1>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '14px' }}>
          Last modified: {new Date(project.lastUpdated).toLocaleString()}
        </div>
        <textarea
          style={{
            width: '100%',
            height: 'calc(100vh - 300px)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '18px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            resize: 'none'
          }}
          placeholder="Start writing project documentation..."
          value={project.notes}
          onChange={(e) => updateNotes(e.target.value)}
        />
      </div>
    </div>
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
               <div style={{ color: project?.deployment?.status === 'active' ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                 ● {project?.deployment?.status === 'active' ? 'ONLINE' : 'OFFLINE'}
               </div>
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

const DeploymentModal = () => {
  const { activeProjectId, projects, revokeDeployment } = useWorkspaceStore();
  const project = projects.find(p => p.id === activeProjectId);
  const deploy = project?.deployment;

  if (!deploy) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div 
        style={{
          width: '600px',
          background: 'var(--bg-color)',
          border: '1px solid var(--border-color)',
          padding: '48px',
          position: 'relative'
        }}
      >
        <h1 style={{ fontSize: '64px', lineHeight: '1', marginBottom: '24px', letterSpacing: '-2px' }}>LIVE LINKED</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--accent-color)', fontWeight: 800, marginBottom: '8px', display: 'block' }}>PUBLIC_ACCESS_URL</label>
            <div style={{ background: '#000', padding: '16px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {deploy.url}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>SECURITY_TOKEN</label>
            <div style={{ background: '#000', padding: '16px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              {deploy.token.slice(0, 16)}...
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', background: 'rgba(0, 255, 95, 0.05)', border: '1px solid var(--accent-color)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '12px', marginBottom: '12px' }}>SYNC_PROTOCOL: REST/WEB_SOCKET_V2</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              This application is currently live-linked to the production database. Logic changes made on the Workflow Mat are applied immediately to the deployed instance without a rebuild.
            </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
           <button className="brute-btn" onClick={() => window.open(deploy.url, '_blank')} style={{ flex: 1 }}>VISIT ENDPOINT</button>
           <button 
             className="brute-btn" 
             style={{ 
               flex: 1, 
               borderColor: deploy.status === 'revoked' ? 'transparent' : 'var(--error)', 
               color: deploy.status === 'revoked' ? 'var(--text-secondary)' : '#ff3b30' 
             }}
             onClick={revokeDeployment}
           >
             {deploy.status === 'revoked' ? 'REVOKED' : 'REVOKE ACCESS'}
           </button>
           <button className="brute-btn" style={{ border: 'none' }} onClick={() => window.location.reload()}>CLOSE</button>
        </div>
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
            <NotesEditor />
          )}
        </div>
      </main>
      <PropertiesPanel />
      <DeploymentModal />
    </div>
  );
}

export default App;
