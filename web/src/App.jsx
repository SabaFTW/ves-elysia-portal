import { useState, useEffect } from 'react';
import './App.css';
import CommandCenter from './components/CommandCenter';
import VESSystemScanner from './components/VESSystemScanner';
import BotMonitor from './components/BotMonitor';
import MessageBuilder from './components/MessageBuilder';
import WeatherDashboard from './components/WeatherDashboard';
import LumoDiNilo from './components/LumoDiNilo';

const API_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000/ws';

function App() {
  const [activeView, setActiveView] = useState('command-center');
  const [wsConnected, setWsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket(WS_URL);

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
        setTimeout(connectWebSocket, 5000);
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
    };
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'command-center':
        return <CommandCenter apiUrl={API_URL} realTimeData={realTimeData} />;
      case 'system-scanner':
        return <VESSystemScanner apiUrl={API_URL} />;
      case 'bot-monitor':
        return <BotMonitor apiUrl={API_URL} realTimeData={realTimeData} />;
      case 'message-builder':
        return <MessageBuilder apiUrl={API_URL} />;
      case 'weather-dashboard':
        return <WeatherDashboard apiUrl={API_URL} realTimeData={realTimeData} />;
      case 'lumo-di-nilo':
        return <LumoDiNilo apiUrl={API_URL} realTimeData={realTimeData} />;
      default:
        return <CommandCenter apiUrl={API_URL} realTimeData={realTimeData} />;
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
