import React, { useState } from 'react';
import { DODGERS_LINEUP, PITCHERS } from '../../data/gameData';
import { calculateOutcome, getRandomVelocity } from '../../utils/pitchCalculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Sub-components defined in the same file for simplicity
const BatterAnalysis = ({ batter }) => (
  <div className="mb-6 p-4 bg-white rounded-lg shadow">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold mb-2">{batter.name}</h3>
        <div className="space-y-1">
          <p>Bats: {batter.bats} | AVG: {batter.avg}</p>
          <p>SLG: {batter.slugging} | OPS: {batter.ops}</p>
        </div>
      </div>
      <div className="border-l pl-4">
        <h4 className="font-bold mb-1">Hot Zones</h4>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(batter.zones).map(([zone, value]) => (
            <div 
              key={zone} 
              className={`p-1 text-xs rounded ${
                parseFloat(value) > 0.300 
                  ? 'bg-red-100' 
                  : 'bg-green-100'
              }`}
            >
              {zone.replace('_', ' ')}: {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PitchSelection = ({ pitcher, onSelect }) => (
  <div className="grid grid-cols-2 gap-2 mb-4">
    {Object.entries(pitcher.pitches).map(([key, pitch]) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <div>{pitch.name}</div>
        <div className="text-sm">{pitch.baseVelo}±{pitch.range} mph</div>
        <div className="text-xs mt-1">{pitch.description}</div>
      </button>
    ))}
  </div>
);

const ZoneSelection = ({ batter, onSelect }) => (
  <div className="grid grid-cols-3 gap-1 mb-4">
    {Object.entries(batter.zones).map(([zone, value]) => (
      <button
        key={zone}
        onClick={() => onSelect(zone)}
        className={`p-2 rounded transition ${
          parseFloat(value) > 0.300
            ? 'bg-red-100 hover:bg-red-200'
            : 'bg-green-100 hover:bg-green-200'
        }`}
      >
        <div className="text-sm font-bold">{zone.replace('_', ' ').toUpperCase()}</div>
        <div className="text-xs">{value}</div>
      </button>
    ))}
  </div>
);

const PitchHistory = ({ history }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 className="font-bold mb-2">Pitch History</h3>
    <div className="space-y-2">
      {history.map((pitch, i) => (
        <div key={i} className="text-sm">
          {pitch.pitch} ({pitch.velocity} mph) - {pitch.location} - {pitch.outcome}
        </div>
      ))}
    </div>
  </div>
);

const Alert = ({ children, className = '' }) => (
    <div className={`p-4 rounded-lg bg-yellow-50 border border-yellow-200 ${className}`}>
      {children}
    </div>
  );

// Main component
const PitcherTrainingTool = () => {
    
  const [gameState, setGameState] = useState({
    currentBatter: 0,
    count: { balls: 0, strikes: 0 },
    bases: [false, false, false],
    inning: 1,
    outs: 0,
    pitchHistory: []
  });

  const [selectedPitcher, setSelectedPitcher] = useState(null);
  const [activePitch, setActivePitch] = useState(null);
  const [lastOutcome, setLastOutcome] = useState(null);

  const updateGameState = (outcome, zone, pitch, velocity) => {
    let newCount = { ...gameState.count };
    let newOuts = gameState.outs;
    let newCurrentBatter = gameState.currentBatter;
    let resultDescription = outcome.description;

    // Update count based on outcome
    switch (outcome.type) {
      case 'SWING_MISS':
        newCount.strikes++;
        break;
      case 'FOUL':
        if (newCount.strikes < 2) newCount.strikes++;
        break;
      case 'TAKE':
        if (zone.includes('middle')) {
          newCount.strikes++;
          resultDescription += " - Strike!";
        } else {
          newCount.balls++;
          resultDescription += " - Ball!";
        }
        break;
      case 'WEAK_CONTACT':
      case 'HARD_CONTACT':
        // These result in immediate outcomes
        newOuts++;
        newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
        newCount = { balls: 0, strikes: 0 };
        break;
      default:
        break;
    }

    // Check for strikeout
    if (newCount.strikes >= 3) {
      resultDescription = "Strikeout! ⚔️";
      newOuts++;
      newCount = { balls: 0, strikes: 0 };
      newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
    }

    // Check for walk
    if (newCount.balls >= 4) {
      resultDescription = "Walk! 🚶";
      newCount = { balls: 0, strikes: 0 };
      newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
    }

    // Check for inning change
    if (newOuts >= 3) {
      setGameState(prev => ({
        ...prev,
        inning: prev.inning + 1,
        outs: 0,
        currentBatter: 0,
        count: { balls: 0, strikes: 0 },
        bases: [false, false, false]
      }));
      return "Inning over! Three outs! ⚾";
    }

    const newPitch = {
      type: activePitch,
      pitch: pitch.name,
      velocity: velocity.toFixed(1),
      location: zone,
      outcome: resultDescription,
      count: `${gameState.count.balls}-${gameState.count.strikes}`
    };

    setGameState(prev => ({
      ...prev,
      count: newCount,
      outs: newOuts,
      currentBatter: newCurrentBatter,
      pitchHistory: [...prev.pitchHistory, newPitch]
    }));

    return resultDescription;
  };

  const handlePitchSelection = (pitchKey) => {
    setActivePitch(pitchKey);
  };

  const handleZoneSelection = (zone) => {
    const pitch = selectedPitcher.pitches[activePitch];
    const velocity = getRandomVelocity(pitch, 
      (gameState.pitchHistory.length / 100) * 20);

    const outcome = calculateOutcome(
      activePitch,
      zone,
      DODGERS_LINEUP[gameState.currentBatter],
      velocity,
      `${gameState.count.balls}-${gameState.count.strikes}`
    );

    const resultDescription = updateGameState(outcome, zone, pitch, velocity);
    setLastOutcome(resultDescription);
    setActivePitch(null);
  };

  console.log('Rendering PitcherTrainingTool', { selectedPitcher, gameState });

  if (!selectedPitcher) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Baseball Pitcher Training Tool</h1>
        <div className="space-y-4">
          {Object.entries(PITCHERS).map(([key, pitcher]) => (
            <button
              key={key}
              onClick={() => setSelectedPitcher(pitcher)}
              className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {pitcher.name} - {pitcher.level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pitcher Training Tool</h1>
        <div className="flex gap-4 text-lg">
          <div>Count: {gameState.count.balls}-{gameState.count.strikes}</div>
          <div>Outs: {gameState.outs}</div>
          <div>Inning: {gameState.inning}</div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold">Now Batting:</h2>
        <p className="text-lg">{DODGERS_LINEUP[gameState.currentBatter].name} ({DODGERS_LINEUP[gameState.currentBatter].avg})</p>
        <p className="text-sm">Bats: {DODGERS_LINEUP[gameState.currentBatter].bats}</p>
      </div>

      <BatterAnalysis 
        batter={DODGERS_LINEUP[gameState.currentBatter]} 
      />

      {lastOutcome && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          {lastOutcome}
        </div>
      )}

      {!activePitch ? (
        <PitchSelection
          pitcher={selectedPitcher}
          onSelect={handlePitchSelection}
        />
      ) : (
        <ZoneSelection
          batter={DODGERS_LINEUP[gameState.currentBatter]}
          onSelect={handleZoneSelection}
        />
      )}

      {gameState.pitchHistory.length > 0 && (
        <PitchHistory history={gameState.pitchHistory} />
      )}
    </div>
  );
};

export default PitcherTrainingTool;