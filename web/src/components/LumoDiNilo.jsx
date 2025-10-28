import { useState, useEffect } from 'react';
import './LumoDiNilo.css';

// Mission data structure
const MISSIONS = {
  global: [
    { id: 'b1', title: 'The Network', subtitle: 'Epstein Forensic Analysis', status: 'unlocked', type: 'basic' },
    { id: 'b2', title: 'Gospodarji Zgodb', subtitle: 'Illuminati Mythology', status: 'locked', type: 'basic' },
    { id: 'b3', title: 'Surveillance Ops', subtitle: 'AI Data Infrastructure', status: 'locked', type: 'basic' }
  ],
  slovenia: [
    { id: 's1', title: 'Palantir & Plastika', subtitle: 'Ghostcore Portal', status: 'locked', type: 'skill' },
    { id: 's2', title: '[Coming Soon]', subtitle: 'TBD', status: 'locked', type: 'skill' },
    { id: 's3', title: '[Coming Soon]', subtitle: 'TBD', status: 'locked', type: 'skill' }
  ]
};

function LumoDiNilo({ apiUrl, realTimeData }) {
  const [activeTab, setActiveTab] = useState('global');
  const [progress, setProgress] = useState({ completed: 0, total: 6 });
  const [missions, setMissions] = useState(MISSIONS);

  // Load progress from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('lumo_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMissions(data.missions);
        setProgress(data.progress);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // Save progress to LocalStorage
  const saveProgress = (updatedMissions) => {
    const completed = [...updatedMissions.global, ...updatedMissions.slovenia]
      .filter(m => m.status === 'completed').length;

    const progressData = {
      missions: updatedMissions,
      progress: { completed, total: 6 }
    };

    localStorage.setItem('lumo_progress', JSON.stringify(progressData));
    setProgress(progressData.progress);
  };

  // Handle mission judgment
  const handleJudgment = (missionId, judgment) => {
    const updatedMissions = { ...missions };

    // Find and update mission
    ['global', 'slovenia'].forEach(category => {
      const mission = updatedMissions[category].find(m => m.id === missionId);
      if (mission) {
        mission.status = judgment === 'vredno' ? 'completed' : 'rejected';

        // Unlock next mission in sequence
        const missionIndex = updatedMissions[category].findIndex(m => m.id === missionId);
        if (missionIndex < updatedMissions[category].length - 1) {
          updatedMissions[category][missionIndex + 1].status = 'unlocked';
        }
      }
    });

    setMissions(updatedMissions);
    saveProgress(updatedMissions);
  };

  // Reset progress (for testing)
  const resetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('lumo_progress');
      setMissions(MISSIONS);
      setProgress({ completed: 0, total: 6 });
    }
  };

  return (
    <div className="lumo-container">
      <header className="lumo-header">
        <div className="lumo-branding">
          <span className="lumo-icon">👁️🔥</span>
          <h1>LUMO DI NILO</h1>
          <p className="lumo-subtitle">Portal moči, svetlobe in resnice</p>
        </div>
        <div className="lumo-progress">
          <span className="progress-text">{progress.completed} / {progress.total}</span>
          {progress.completed === 6 && (
            <a
              href="https://sabaftw.github.io/imagine-claude/portals/BLOOM.html"
              target="_blank"
              rel="noopener noreferrer"
              className="unlock-ritual"
            >
              🔥 UNLOCK RITUAL CHAMBER
            </a>
          )}
          <button className="reset-btn" onClick={resetProgress} title="Reset Progress">
            🔄
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="lumo-tabs">
        <button
          className={`tab ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          🌍 GLOBAL
        </button>
        <button
          className={`tab ${activeTab === 'slovenia' ? 'active' : ''}`}
          onClick={() => setActiveTab('slovenia')}
        >
          🇸🇮 SLOVENIJA
        </button>
        <button
          className={`tab ${activeTab === 'arhiv' ? 'active' : ''}`}
          onClick={() => setActiveTab('arhiv')}
        >
          📂 ARHIV
        </button>
      </nav>

      {/* Mission Cards */}
      <div className="mission-grid">
        {activeTab === 'arhiv' ? (
          <div className="arhiv-message">
            <h2>📂 Coming Soon</h2>
            <p>Your completed missions will be archived here.</p>
          </div>
        ) : (
          missions[activeTab]?.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onJudgment={handleJudgment}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Mission Card Subcomponent
function MissionCard({ mission, onJudgment }) {
  return (
    <div className={`mission-card ${mission.status}`}>
      <div className="mission-header">
        <span className="mission-icon">{mission.type === 'basic' ? '🔺' : '⬡'}</span>
        <div className="mission-info">
          <h3>{mission.title}</h3>
          <p>{mission.subtitle}</p>
        </div>
      </div>

      {mission.status === 'unlocked' && (
        <div className="mission-actions">
          <button
            className="judgment-btn vredno"
            onClick={() => onJudgment(mission.id, 'vredno')}
          >
            ✅ VREDNO
          </button>
          <button
            className="judgment-btn nevredno"
            onClick={() => onJudgment(mission.id, 'nevredno')}
          >
            ❌ NEVREDNO
          </button>
        </div>
      )}

      {mission.status === 'completed' && (
        <div className="mission-status completed">✅ Completed</div>
      )}

      {mission.status === 'rejected' && (
        <div className="mission-status rejected">❌ Rejected</div>
      )}

      {mission.status === 'locked' && (
        <div className="mission-status locked">🔒 Locked</div>
      )}
    </div>
  );
}

export default LumoDiNilo;
