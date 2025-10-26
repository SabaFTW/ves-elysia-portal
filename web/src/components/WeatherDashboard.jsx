import { useState, useEffect } from 'react';
import './WeatherDashboard.css';

function WeatherDashboard({ apiUrl, realTimeData }) {
  const [weatherData, setWeatherData] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchWeatherData();
    fetchWeatherAlerts();
    
    // Refresh every 5 minutes (ARSO updates every 5 minutes)
    const interval = setInterval(() => {
      fetchWeatherData();
      fetchWeatherAlerts();
    }, 300000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update with real-time data if available
  useEffect(() => {
    if (realTimeData?.weather) {
      setWeatherData(realTimeData.weather);
      setLastUpdate(new Date().toISOString());
    }
    if (realTimeData?.alerts) {
      setWeatherAlerts(realTimeData.alerts);
    }
  }, [realTimeData]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/weather/current`);
      const data = await response.json();

      if (data.success) {
        setWeatherData(data.data || []);
        setLastUpdate(data.timestamp);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherAlerts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/weather/alerts`);
      const data = await response.json();

      if (data.success) {
        setWeatherAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
    }
  };

  const getAlertEmoji = (severity) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'low':
        return '🟡';
      default:
        return '⚠️';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="weather-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-dashboard">
      <header className="dashboard-header">
        <h2>🌊 ARSO Weather Monitor</h2>
        <div className="header-info">
          <span className="update-time">
            Last update: {formatTimestamp(lastUpdate)}
          </span>
          <span className="station-count">
            {weatherData.length} Stations
          </span>
        </div>
      </header>

      {/* Weather Alerts Section */}
      {weatherAlerts.length > 0 && (
        <section className="alerts-section">
          <h3>⚠️ Active Alerts ({weatherAlerts.length})</h3>
          <div className="alerts-grid">
            {weatherAlerts.map((alert, index) => (
              <div key={index} className={`alert-card alert-${alert.severity}`}>
                <div className="alert-header">
                  <span className="alert-emoji">{getAlertEmoji(alert.severity)}</span>
                  <span className="alert-type">{alert.type}</span>
                </div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-details">
                  <span>Value: {alert.value}</span>
                  <span>Threshold: {alert.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weather Stations Section */}
      <section className="stations-section">
        <h3>📊 Weather Stations</h3>
        
        {weatherData.length === 0 ? (
          <div className="no-data">
            <p>No weather data available</p>
            <p className="hint">Check ARSO connector status</p>
          </div>
        ) : (
          <div className="stations-grid">
            {weatherData.map((station) => (
              <div key={station.station_id} className="station-card">
                <div className="station-header">
                  <h4>{station.station_name}</h4>
                  <span className="station-river">{station.river_name}</span>
                </div>
                
                <div className="station-metrics">
                  {station.water_level !== null && (
                    <div className="metric">
                      <span className="metric-icon">💧</span>
                      <div className="metric-info">
                        <span className="metric-label">Water Level</span>
                        <span className="metric-value">
                          {station.water_level} <small>cm</small>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {station.flow_rate !== null && (
                    <div className="metric">
                      <span className="metric-icon">🌊</span>
                      <div className="metric-info">
                        <span className="metric-label">Flow Rate</span>
                        <span className="metric-value">
                          {station.flow_rate} <small>m³/s</small>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {station.temperature !== null && (
                    <div className="metric">
                      <span className="metric-icon">🌡️</span>
                      <div className="metric-info">
                        <span className="metric-label">Temperature</span>
                        <span className="metric-value">
                          {station.temperature} <small>°C</small>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="station-footer">
                  <span className="station-time">
                    {formatTimestamp(station.timestamp)}
                  </span>
                  {station.latitude && station.longitude && (
                    <span className="station-coords">
                      📍 {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h4>ℹ️ About ARSO Weather Data</h4>
          <p>
            Data provided by ARSO (Slovenian Environment Agency). 
            Updates every 5 minutes with real-time hydrometeorological measurements 
            from monitoring stations across Slovenia.
          </p>
          <div className="info-links">
            <a 
              href="https://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              📄 View Raw XML Data
            </a>
            <a 
              href="https://www.arso.gov.si/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              🌐 Visit ARSO Website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WeatherDashboard;
