import { useState, useEffect } from 'react';
import './CommandCenter.css';

function CommandCenter({ apiUrl, realTimeData }) {
  const [daemonStatus, setDaemonStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDaemonStatus();
    const interval = setInterval(fetchDaemonStatus, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  // Update with real-time data if available
  useEffect(() => {
    if (realTimeData) {
      setDaemonStatus(realTimeData);
    }
  }, [realTimeData]);

  const fetchDaemonStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/daemon/status`);
      const data = await response.json();

      if (data.success) {
        setDaemonStatus(data);
      }
    } catch (error) {
      console.error('Error fetching daemon status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDaemonControl = async (action) => {
    try {
      const response = await fetch(`${apiUrl}/api/daemon/${action}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        alert(`Wolf Daemon ${action}ed successfully!`);
        fetchDaemonStatus();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing daemon:`, error);
      alert(`Failed to ${action} daemon`);
    }
  };

  if (loading) {
    return <div className="command-center loading">Loading...</div>;
  }

  return (
    <div className="command-center">
      <div className="section-header">
        <h2>🎯 Command Center</h2>
        <p>Real-time monitoring and control of VES infrastructure</p>
      </div>

      <div className="dashboard-grid">
        {/* Wolf Daemon Status */}
        <div className="dashboard-card daemon-status">
          <div className="card-header">
            <h3>🐺 Wolf Daemon</h3>
            <span className={`status-badge ${daemonStatus?.daemon?.running ? 'active' : 'inactive'}`}>
              {daemonStatus?.daemon?.running ? 'Running' : 'Stopped'}
            </span>
          </div>

          <div className="card-content">
            {daemonStatus?.daemon?.running ? (
              <div className="status-details">
                <p><strong>PID:</strong> {daemonStatus.daemon.pid}</p>
                <p><strong>Status:</strong> Operational</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDaemonControl('stop')}
                >
                  Stop Daemon
                </button>
              </div>
            ) : (
              <div className="status-details">
                <p>Wolf Daemon is not running</p>
                <button
                  className="btn btn-success"
                  onClick={() => handleDaemonControl('start')}
                >
                  Start Daemon
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="dashboard-card recent-logs">
          <div className="card-header">
            <h3>📋 Recent Activity</h3>
          </div>
          <div className="card-content">
            {daemonStatus?.recentLogs && daemonStatus.recentLogs.length > 0 ? (
              <div className="logs-list">
                {daemonStatus.recentLogs.map((log, index) => (
                  <div key={index} className={`log-entry log-${log.level.toLowerCase()}`}>
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-level">{log.level}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent activity</p>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="dashboard-card system-info">
          <div className="card-header">
            <h3>ℹ️ System Info</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">API Server</span>
                <span className="info-value">Connected</span>
              </div>
              <div className="info-item">
                <span className="info-label">WebSocket</span>
                <span className="info-value">
                  {realTimeData ? '🟢 Live' : '🟡 Polling'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">VES Version</span>
                <span className="info-value">v1.0.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Update</span>
                <span className="info-value">
                  {daemonStatus?.timestamp ? new Date(daemonStatus.timestamp).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>⚡ Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="action-grid">
              <button className="action-btn" onClick={() => window.location.reload()}>
                <span>🔄</span>
                <span>Refresh</span>
              </button>
              <button className="action-btn" onClick={fetchDaemonStatus}>
                <span>📊</span>
                <span>Update Status</span>
              </button>
              <button className="action-btn" onClick={() => window.open(`${apiUrl}/api/daemon/logs`, '_blank')}>
                <span>📋</span>
                <span>View Logs</span>
              </button>
              <button className="action-btn" onClick={() => alert('Coming soon!')}>
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandCenter;
