import { useState } from 'react';
import './VESSystemScanner.css';

function VESSystemScanner({ apiUrl }) {
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanPath, setScanPath] = useState('');

  const handleScan = async () => {
    setLoading(true);

    try {
      const url = scanPath
        ? `${apiUrl}/api/scan?path=${encodeURIComponent(scanPath)}`
        : `${apiUrl}/api/scan`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setScanResults(data.results);
      } else {
        alert('Error scanning filesystem');
      }
    } catch (error) {
      console.error('Error scanning:', error);
      alert('Failed to scan filesystem');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="ves-scanner">
      <div className="section-header">
        <h2>📊 VES System Scanner</h2>
        <p>Explore the VES filesystem and monitor file activity</p>
      </div>

      <div className="scanner-controls">
        <input
          type="text"
          className="path-input"
          placeholder="Enter path to scan (leave empty for default VES directory)"
          value={scanPath}
          onChange={(e) => setScanPath(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {scanResults.length > 0 && (
        <div className="scan-results">
          <div className="results-header">
            <h3>Results ({scanResults.length} items)</h3>
          </div>

          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Modified</th>
                  <th>Path</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((item, index) => (
                  <tr key={index} className={`item-${item.type}`}>
                    <td>
                      <span className="type-icon">
                        {item.type === 'directory' ? '📁' : '📄'}
                      </span>
                    </td>
                    <td className="item-name">{item.name}</td>
                    <td>{item.type === 'file' ? formatSize(item.size) : '-'}</td>
                    <td>{formatDate(item.modified)}</td>
                    <td className="item-path">{item.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {scanResults.length === 0 && !loading && (
        <div className="empty-state">
          <p>No scan results yet. Click "Scan" to explore the VES filesystem.</p>
        </div>
      )}
    </div>
  );
}

export default VESSystemScanner;
