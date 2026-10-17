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
import { AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`app-toast ${toastMessage.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toastMessage.type === 'success' ? <CheckCircle size={16} color="#34d399" /> : <AlertCircle size={16} color="#fda4af" />}
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

      {/* Compact Quick Demo Scenario Bar */}
      <DemoScenarioBar
        onSelectPlot={handleSelectPlot}
        currentSelectedPlotId={selectedPlotId}
        onOpenDemoScriptModal={() => setIsDemoScriptOpen(true)}
      />

      {/* Main View Area */}
      <main className="app-main">
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

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div>
            <strong style={{ color: '#ffffff' }}>PlotGuard</strong> • Land Fraud & Inconsistency Detection Prototype
            <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>|</span>
            LandTech Innovation Hackathon 2026 (Problem Track P3)
          </div>

          <div>
            <span>Fictional sample records only</span>
            <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>•</span>
            <span>Explainable screening alerts for authorized officers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
