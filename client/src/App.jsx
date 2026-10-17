import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DemoScenarioBar from './components/DemoScenarioBar';
import DashboardView from './components/DashboardView';
import CadastralRegistryView from './components/CadastralRegistryView';
import PlotTimelineView from './components/PlotTimelineView';
import EvidenceInspectorModal from './components/EvidenceInspectorModal';
import AuditLogView from './components/AuditLogView';
import DocumentVerifierView from './components/DocumentVerifierView';
import DemoScriptModal from './components/DemoScriptModal';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState(null);
  const [plots, setPlots] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Selection states
  const [selectedPlotId, setSelectedPlotId] = useState('PLOT-1042');
  const [inspectingAlert, setInspectingAlert] = useState(null);
  const [selectedDeedForVerification, setSelectedDeedForVerification] = useState('DEED-2026-0042-A');
  const [isDemoScriptOpen, setIsDemoScriptOpen] = useState(false);

  // Operation states
  const [isRunningDetection, setIsRunningDetection] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch system health
  const checkHealth = () => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => {
        console.warn('Backend not responding:', err);
        setSystemStatus({ status: 'offline', database: 'Connecting...' });
      });
  };

  // Fetch plots
  const loadPlots = () => {
    fetch('/api/plots')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlots(data.data);
        }
      })
      .catch(err => console.error('Error loading plots:', err));
  };

  // Fetch alerts
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
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Run Detection Engine
  const handleRunDetection = async () => {
    setIsRunningDetection(true);
    try {
      const res = await fetch('/api/detections/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId: 'REV-OFFICER-01', reviewerName: 'Land Officer Tariq Khan' })
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

  // Reset demo data
  const handleResetData = async () => {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadPlots();
        loadAlerts();
        showToast('success', 'Demo data successfully reset to benchmark evaluation state.');
      }
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Select plot and switch to timeline view
  const handleSelectPlot = (plotId) => {
    setSelectedPlotId(plotId);
    setActiveTab('timeline');
  };

  // Verify deed hash
  const handleVerifyDeedHash = (deedRef) => {
    setSelectedDeedForVerification(deedRef);
    setActiveTab('verifier');
  };

  // Alert review status updated
  const handleAlertStatusUpdated = (updatedAlert) => {
    setAlerts(prev => prev.map(a => a.alertId === updatedAlert.alertId ? updatedAlert : a));
    loadPlots();
    loadAlerts();
    showToast('success', `Alert '${updatedAlert.alertId}' updated to '${updatedAlert.reviewStatus}'.`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 2000,
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          background: toastMessage.type === 'success' ? '#064e3b' : '#881337',
          border: `1px solid ${toastMessage.type === 'success' ? '#10b981' : '#f43f5e'}`,
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.85rem'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle size={18} color="#34d399" /> : <AlertCircle size={18} color="#fb7185" />}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        onRunDetection={handleRunDetection}
        onResetData={handleResetData}
        isRunningDetection={isRunningDetection}
      />

      {/* Quick Demo Scenario Bar */}
      <DemoScenarioBar
        onSelectPlot={handleSelectPlot}
        currentSelectedPlotId={selectedPlotId}
        onOpenDemoScriptModal={() => setIsDemoScriptOpen(true)}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            alerts={alerts}
            stats={stats}
            plots={plots}
            onInspectAlert={alert => setInspectingAlert(alert)}
            onOpenPlotTimeline={handleSelectPlot}
            onRunDetection={handleRunDetection}
            isRunningDetection={isRunningDetection}
          />
        )}

        {activeTab === 'registry' && (
          <CadastralRegistryView
            plots={plots}
            onOpenPlotTimeline={handleSelectPlot}
          />
        )}

        {activeTab === 'timeline' && (
          <PlotTimelineView
            plotId={selectedPlotId}
            onBack={() => setActiveTab('dashboard')}
            onInspectAlert={alert => setInspectingAlert(alert)}
            onVerifyDeedHash={handleVerifyDeedHash}
            onSelectAnotherPlot={id => setSelectedPlotId(id)}
            allPlots={plots}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}

        {activeTab === 'verifier' && (
          <DocumentVerifierView
            initialDeedRef={selectedDeedForVerification}
          />
        )}
      </main>

      {/* Evidence Inspector Modal */}
      {inspectingAlert && (
        <EvidenceInspectorModal
          alert={inspectingAlert}
          onClose={() => setInspectingAlert(null)}
          onStatusUpdated={handleAlertStatusUpdated}
          onOpenPlotTimeline={handleSelectPlot}
        />
      )}

      {/* 3-Minute Demo Script Guide Modal */}
      {isDemoScriptOpen && (
        <DemoScriptModal
          onClose={() => setIsDemoScriptOpen(false)}
          onSelectPlot={handleSelectPlot}
        />
      )}

      {/* Professional Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.95)',
        padding: '1.25rem 1.5rem',
        fontSize: '0.78rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>PlotGuard</strong> • Land Fraud & Ownership Inconsistency Detection Prototype
            <span style={{ margin: '0 0.5rem' }}>|</span>
            LandTech Innovation Hackathon 2026 (Track P3)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Fictional / sample records only</span>
            <span>•</span>
            <span>Human-in-the-loop screening principle</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
