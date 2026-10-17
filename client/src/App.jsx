import React, { useState, useEffect } from 'react';
import { CircleCheck, OctagonAlert } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './components/DashboardView';
import CadastralRegistryView from './components/CadastralRegistryView';
import PlotTimelineView from './components/PlotTimelineView';
import EvidenceInspectorModal from './components/EvidenceInspectorModal';
import AuditLogView from './components/AuditLogView';
import DocumentVerifierView from './components/DocumentVerifierView';
import DemoScriptModal from './components/DemoScriptModal';
import './styles/AppShell.css';
import './styles/Views.css';

const PAGE_META = {
  dashboard: { title: 'Alert queue', subtitle: 'Rule-triggered inconsistencies awaiting officer review' },
  registry: { title: 'Parcel registry', subtitle: 'Sample cadastral records under screening' },
  timeline: { title: 'Plot timeline', subtitle: 'Chronological deeds, transfers, and mutations' },
  audit: { title: 'Audit trail', subtitle: 'Immutable log of detection runs and review actions' },
  verifier: { title: 'Deed verifier', subtitle: 'SHA-256 integrity check against the registry archive' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState(null);
  const [plots, setPlots] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);

  const [selectedPlotId, setSelectedPlotId] = useState('PLOT-1042');
  const [inspectingAlert, setInspectingAlert] = useState(null);
  const [selectedDeedForVerification, setSelectedDeedForVerification] = useState('DEED-2026-0042-A');
  const [isDemoScriptOpen, setIsDemoScriptOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isRunningDetection, setIsRunningDetection] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('plotguard-theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const checkHealth = () => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(() => setSystemStatus({ status: 'offline', database: 'Backend offline' }));
  };

  const loadPlots = () => {
    fetch('/api/plots')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlots(data.data);
      })
      .catch(err => console.error('Error loading plots:', err));
  };

  const loadAlerts = () => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlerts(data.data);
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Error loading alerts:', err));
  };

  useEffect(() => {
    checkHealth();
    loadPlots();
    loadAlerts();
  }, []);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRunDetection = async () => {
    setIsRunningDetection(true);
    try {
      const res = await fetch('/api/detections/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId: 'REV-OFFICER-01', reviewerName: 'Land Officer Tariq Khan' }),
      });
      const data = await res.json();
      if (data.success) {
        loadPlots();
        loadAlerts();
        showToast('success', data.message);
      } else {
        showToast('error', data.error || 'Detection failed');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsRunningDetection(false);
    }
  };

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadPlots();
        loadAlerts();
        showToast('success', 'Sample data reset to the seeded benchmark state.');
      }
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleSelectPlot = (plotId) => {
    setSelectedPlotId(plotId);
    navigate('timeline');
  };

  const handleVerifyDeedHash = (deedRef) => {
    setSelectedDeedForVerification(deedRef);
    navigate('verifier');
  };

  const handleAlertStatusUpdated = (updatedAlert) => {
    setAlerts(prev => prev.map(a => (a.alertId === updatedAlert.alertId ? updatedAlert : a)));
    loadPlots();
    loadAlerts();
    showToast('success', `${updatedAlert.alertId} marked as ${updatedAlert.reviewStatus}.`);
  };

  const meta = PAGE_META[activeTab];
  const openCount = stats?.openReviews ?? 0;

  return (
    <div className="shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={navigate}
        onSelectPlot={handleSelectPlot}
        selectedPlotId={selectedPlotId}
        openCount={openCount}
        onOpenGuide={() => setIsDemoScriptOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="shell-main">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          systemStatus={systemStatus}
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          onRunDetection={handleRunDetection}
          onResetData={handleResetData}
          isRunningDetection={isRunningDetection}
          onOpenMenu={() => setIsSidebarOpen(true)}
        />

        <main className="shell-content">
          {activeTab === 'dashboard' && (
            <DashboardView
              alerts={alerts}
              stats={stats}
              plots={plots}
              onInspectAlert={setInspectingAlert}
              onOpenPlotTimeline={handleSelectPlot}
            />
          )}

          {activeTab === 'registry' && (
            <CadastralRegistryView plots={plots} onOpenPlotTimeline={handleSelectPlot} />
          )}

          {activeTab === 'timeline' && (
            <PlotTimelineView
              plotId={selectedPlotId}
              onBack={() => navigate('dashboard')}
              onInspectAlert={setInspectingAlert}
              onVerifyDeedHash={handleVerifyDeedHash}
              onSelectAnotherPlot={setSelectedPlotId}
              allPlots={plots}
            />
          )}

          {activeTab === 'audit' && <AuditLogView />}

          {activeTab === 'verifier' && (
            <DocumentVerifierView key={selectedDeedForVerification} initialDeedRef={selectedDeedForVerification} />
          )}
        </main>

        <footer className="shell-footer">
          <span>PlotGuard screening prototype. Fictional sample records only.</span>
          <span>Alerts flag inconsistencies for human review and are not legal findings.</span>
        </footer>
      </div>

      {inspectingAlert && (
        <EvidenceInspectorModal
          alert={inspectingAlert}
          onClose={() => setInspectingAlert(null)}
          onStatusUpdated={handleAlertStatusUpdated}
          onOpenPlotTimeline={handleSelectPlot}
        />
      )}

      {isDemoScriptOpen && (
        <DemoScriptModal onClose={() => setIsDemoScriptOpen(false)} onSelectPlot={handleSelectPlot} />
      )}

      {toastMessage && (
        <div className={`toast toast--${toastMessage.type}`} role="status" aria-live="polite">
          {toastMessage.type === 'success' ? <CircleCheck size={16} /> : <OctagonAlert size={16} />}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
