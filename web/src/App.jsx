import { useState, useEffect, useMemo } from 'react';
import './App.css';
import CommandCenter from './components/CommandCenter';
import VESSystemScanner from './components/VESSystemScanner';
import BotMonitor from './components/BotMonitor';
import MessageBuilder from './components/MessageBuilder';
import WeatherDashboard from './components/WeatherDashboard';
import LumoDiNilo from './components/LumoDiNilo';

const resolveApiUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/?$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

const resolveWsUrl = () => {
  const envUrl = import.meta.env?.VITE_WS_URL?.trim();

  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    const { protocol, host } = window.location;
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${host}/ws`;
  }

  return '';
};

function App() {
  const [activeView, setActiveView] = useState('command-center');
  const [wsConnected, setWsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const apiUrl = useMemo(() => resolveApiUrl(), []);
  const wsUrl = useMemo(() => resolveWsUrl(), []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      if (!wsUrl) {
        console.warn('WebSocket URL is not configured. Skipping connection attempt.');
        return;
      }

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📡 WebSocket data:', data);

        if (data.type === 'update') {
          setRealTimeData(data.data);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setWsConnected(false);

        // Attempt to reconnect after 5 seconds
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [wsUrl]);

  const renderView = () => {
    switch (activeView) {
      case 'command-center':
        return <CommandCenter apiUrl={apiUrl} realTimeData={realTimeData} />;
      case 'system-scanner':
        return <VESSystemScanner apiUrl={apiUrl} />;
      case 'bot-monitor':
        return <BotMonitor apiUrl={apiUrl} realTimeData={realTimeData} />;
      case 'message-builder':
        return <MessageBuilder apiUrl={apiUrl} />;
      case 'weather-dashboard':
        return <WeatherDashboard apiUrl={apiUrl} realTimeData={realTimeData} />;
      case 'lumo-di-nilo':
        return <LumoDiNilo apiUrl={apiUrl} realTimeData={realTimeData} />;
      default:
        return <CommandCenter apiUrl={apiUrl} realTimeData={realTimeData} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🐺</span>
            <h1>VES Portal</h1>
          </div>
          <div className="header-status">
            <span className={`status-indicator ${wsConnected ? 'connected' : 'disconnected'}`}>
              {wsConnected ? '🟢 Live' : '🔴 Offline'}
            </span>
          </div>
        </div>
      </header>

      <div className="app-layout">
        <nav className="sidebar">
          <div className="nav-items">
            <button
              className={`nav-item ${activeView === 'command-center' ? 'active' : ''}`}
              onClick={() => setActiveView('command-center')}
            >
              <span className="nav-icon">🎯</span>
              <span>Command Center</span>
            </button>
            <button
              className={`nav-item ${activeView === 'system-scanner' ? 'active' : ''}`}
              onClick={() => setActiveView('system-scanner')}
            >
              <span className="nav-icon">📊</span>
              <span>System Scanner</span>
            </button>
            <button
              className={`nav-item ${activeView === 'bot-monitor' ? 'active' : ''}`}
              onClick={() => setActiveView('bot-monitor')}
            >
              <span className="nav-icon">🤖</span>
              <span>Bot Monitor</span>
            </button>
            <button
              className={`nav-item ${activeView === 'message-builder' ? 'active' : ''}`}
              onClick={() => setActiveView('message-builder')}
            >
              <span className="nav-icon">✉️</span>
              <span>Message Builder</span>
            </button>
            <button
              className={`nav-item ${activeView === 'weather-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('weather-dashboard')}
            >
              <span className="nav-icon">🌊</span>
              <span>Weather Monitor</span>
            </button>
            <button
              className={`nav-item ${activeView === 'lumo-di-nilo' ? 'active' : ''}`}
              onClick={() => setActiveView('lumo-di-nilo')}
            >
              <span className="nav-icon">👁️🔥</span>
              <span>Lumo di Nilo</span>
            </button>
          </div>
        </nav>

        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
