import { useState, useEffect } from 'react';
import './LumoDiNilo.css';

// Mission data structure
const MISSIONS = {
  global: [
    {
      id: 'b1',
      title: 'The Network',
      subtitle: 'Epstein Forensic Analysis',
      status: 'unlocked',
      type: 'basic',
      description: '724-line deep dive into power networks and systemic patterns'
    },
    {
      id: 'b2',
      title: 'Gospodarji Zgodb',
      subtitle: 'Illuminati Mythology',
      status: 'locked',
      type: 'basic',
      description: 'Decoding the myth-makers and narrative architects'
    },
    {
      id: 'b3',
      title: 'Surveillance Ops',
      subtitle: 'AI Data Infrastructure',
      status: 'locked',
      type: 'basic',
      description: 'The architecture of digital omniscience'
    }
  ],
  slovenia: [
    {
      id: 's1',
      title: 'Palantir & Plastika',
      subtitle: 'Ghostcore Portal',
      status: 'locked',
      type: 'skill',
      description: 'Slovenian tech infrastructure and hidden networks'
    },
    {
      id: 's2',
      title: '[Coming Soon]',
      subtitle: 'Research in Progress',
      status: 'locked',
      type: 'skill',
      description: 'New Slovenia-specific investigation'
    },
    {
      id: 's3',
      title: '[Coming Soon]',
      subtitle: 'Research in Progress',
      status: 'locked',
      type: 'skill',
      description: 'New Slovenia-specific investigation'
    }
  ]
};

function LumoDiNilo({ apiUrl, realTimeData }) {
  const [activeTab, setActiveTab] = useState('global');
  const [progress, setProgress] = useState({ completed: 0, total: 6 });
  const [missions, setMissions] = useState(MISSIONS);
  const [selectedMission, setSelectedMission] = useState(null);

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
        const index = updatedMissions[category].indexOf(mission);
        if (index < updatedMissions[category].length - 1 && judgment === 'vredno') {
          updatedMissions[category][index + 1].status = 'unlocked';
        }
      }
    });

    setMissions(updatedMissions);
    saveProgress(updatedMissions);
    setSelectedMission(null);
  };

  // Handle mission click
  const handleMissionClick = (mission) => {
    if (mission.status === 'unlocked') {
      setSelectedMission(mission);
    }
  };

  // Reset progress (for testing)
  const resetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('lumo_progress');
      setMissions(MISSIONS);
      setProgress({ completed: 0, total: 6 });
      setSelectedMission(null);
    }
  };

  const currentMissions = activeTab === 'slovenia' ? missions.slovenia : missions.global;
  const completedMissions = [...missions.global, ...missions.slovenia].filter(m => m.status === 'completed');

  return (
    <div className="lumo-container">
      <header className="lumo-header">
        <div className="lumo-branding">
          <div className="lumo-title-row">
            <span className="lumo-icon">👁️🔥</span>
            <h1>LUMO DI NILO</h1>
          </div>
          <p className="lumo-subtitle">🜂 Portal moči, svetlobe in resnice 🜂</p>
          <p className="lumo-tagline">Sidro drži. Plamen gori. Mit živi.</p>
        </div>
        <div className="lumo-progress">
          <div className="progress-display">
            <span className="progress-text">{progress.completed} / {progress.total}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
          </div>
          {progress.completed === 6 && (
            <a
              href="https://sabaftw.github.io/imagine-claude/portals/BLOOM.html"
              target="_blank"
              rel="noopener noreferrer"
              className="unlock-ritual"
            >
              🔥 UNLOCK RITUAL CHAMBER 🔥
            </a>
          )}
          <button onClick={resetProgress} className="reset-btn">🔄 Reset Progress</button>
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

      {/* Mission Grid */}
      {activeTab !== 'arhiv' && (
        <div className="mission-grid">
          {currentMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => handleMissionClick(mission)}
              isSelected={selectedMission?.id === mission.id}
            />
          ))}
        </div>
      )}

      {/* Archive View */}
      {activeTab === 'arhiv' && (
        <div className="archive-view">
          <h2>📂 Completed Missions</h2>
          {completedMissions.length === 0 ? (
            <p className="archive-empty">No completed missions yet. Begin your journey.</p>
          ) : (
            <div className="archive-grid">
              {completedMissions.map(mission => (
                <div key={mission.id} className="archive-card">
                  <span className="archive-icon">{mission.type === 'basic' ? '🔺' : '⬡'}</span>
                  <div>
                    <h3>{mission.title}</h3>
                    <p>{mission.subtitle}</p>
                    <span className="archive-status">✅ Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="mission-modal" onClick={() => setSelectedMission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMission(null)}>✕</button>
            <div className="modal-header">
              <span className="modal-icon">{selectedMission.type === 'basic' ? '🔺' : '⬡'}</span>
              <div>
                <h2>{selectedMission.title}</h2>
                <p>{selectedMission.subtitle}</p>
              </div>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedMission.description}</p>
              <p className="modal-instruction">🜂 Review this mission. Is it VREDNO (worthy) or NEVREDNO (unworthy)?</p>
            </div>
            <div className="modal-actions">
              <button
                className="judgment-btn vredno"
                onClick={() => handleJudgment(selectedMission.id, 'vredno')}
              >
                ✅ VREDNO
              </button>
              <button
                className="judgment-btn nevredno"
                onClick={() => handleJudgment(selectedMission.id, 'nevredno')}
              >
                ❌ NEVREDNO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mission Card Subcomponent
function MissionCard({ mission, onClick, isSelected }) {
  return (
    <div
      className={`mission-card ${mission.status} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ cursor: mission.status === 'unlocked' ? 'pointer' : 'default' }}
    >
      <div className="mission-header">
        <span className="mission-icon">{mission.type === 'basic' ? '🔺' : '⬡'}</span>
        <div className="mission-info">
          <h3>{mission.title}</h3>
          <p>{mission.subtitle}</p>
        </div>
      </div>

      <div className="mission-footer">
        {mission.status === 'unlocked' && (
          <div className="mission-status unlocked">🔓 Click to review</div>
        )}

        {mission.status === 'completed' && (
          <div className="mission-status completed">✅ Completed</div>
        )}

        {mission.status === 'locked' && (
          <div className="mission-status locked">🔒 Locked</div>
        )}

        {mission.status === 'rejected' && (
          <div className="mission-status rejected">❌ Rejected</div>
        )}
      </div>
    </div>
  );
}

export default LumoDiNilo;
