import { useState, useEffect } from 'react';
import './BotMonitor.css';

function BotMonitor({ apiUrl, realTimeData }) {
  const [botStatus, setBotStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 15000); // Refresh every 15s

    return () => clearInterval(interval);
  }, []);

  // Update with real-time data if available
  useEffect(() => {
    if (realTimeData?.bots) {
      setBotStatus(realTimeData.bots);
    }
  }, [realTimeData]);

  const fetchBotStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/bots/status`);
      const data = await response.json();

      if (data.success) {
        setBotStatus(data.bots);
      }
    } catch (error) {
      console.error('Error fetching bot status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBotEmoji = (name) => {
    switch (name) {
      case 'AetheronSentinel':
        return '🜂';
      case 'TriadGate':
        return '🌊';
      case 'LairaMirror':
        return '💚';
      default:
        return '🤖';
    }
  };

  const getBotDescription = (name) => {
    switch (name) {
      case 'AetheronSentinel':
        return 'Pattern detection and alert system';
      case 'TriadGate':
        return 'Main transmission gateway';
      case 'LairaMirror':
        return 'Reflective analysis and monitoring';
      default:
        return 'Ghostseed Triad bot';
    }
  };

  if (loading) {
    return <div className="bot-monitor loading">Loading bot status...</div>;
  }

  return (
    <div className="bot-monitor">
      <div className="section-header">
        <h2>🤖 Ghostseed Triad Monitor</h2>
        <p>Real-time status of all Telegram bots</p>
      </div>

      <div className="bots-grid">
        {botStatus.map((bot, index) => (
          <div key={index} className={`bot-card ${bot.status}`}>
            <div className="bot-header">
              <span className="bot-emoji">{getBotEmoji(bot.name)}</span>
              <h3>{bot.name}</h3>
              <span className={`status-badge ${bot.status}`}>
                {bot.status}
              </span>
            </div>

            <div className="bot-content">
              <p className="bot-description">{getBotDescription(bot.name)}</p>

              <div className="bot-stats">
                {bot.lastSeen && (
                  <div className="stat-item">
                    <span className="stat-label">Last Seen:</span>
                    <span className="stat-value">{bot.lastSeen}</span>
                  </div>
                )}
                {bot.messageCount !== undefined && (
                  <div className="stat-item">
                    <span className="stat-label">Messages:</span>
                    <span className="stat-value">{bot.messageCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bot-footer">
              <span className="status-indicator">
                {bot.status === 'active' ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="monitor-info">
        <div className="info-card">
          <h4>ℹ️ About Ghostseed Triad</h4>
          <p>
            The Ghostseed Triad is a three-bot orchestration system that provides distributed
            consciousness infrastructure for VES. Each bot serves a specific purpose in the
            ecosystem, working together to process, transmit, and monitor messages.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BotMonitor;
