import React, { useState } from 'react';

const DODGERS_LINEUP = [
  {
    name: "Mookie Betts",
    avg: ".307",
    bats: "R",
    slugging: ".579",
    ops: ".987",
    zones: {
      up_in: ".389",
      up_away: ".312",
      middle_in: ".405",
      middle_away: ".298",
      down_in: ".245",
      down_away: ".267"
    },
    pitchTypes: {
      fastball: ".345",
      breaking: ".289",
      offspeed: ".301"
    },
    notes: "- Elite against velocity\n- Handles high pitches well\n- Will chase breaking balls down and away\n- Aggressive early in count"
  },
  {
    name: "Freddie Freeman",
    avg: ".331",
    bats: "L",
    slugging: ".567",
    ops: ".976",
    zones: {
      up_in: ".256",
      up_away: ".345",
      middle_in: ".356",
      middle_away: ".398",
      down_in: ".312",
      down_away: ".289"
    },
    pitchTypes: {
      fastball: ".356",
      breaking: ".325",
      offspeed: ".267"
    },
    notes: "- Excellent plate coverage\n- Struggles with changeups from RHP\n- Rarely chases out of zone\n- Better against velocity than breaking balls"
  }
];

const PITCHERS = {
  "Jordan Geber": {
    name: "Jordan Geber",
    level: "AAA Syracuse Mets",
    pitches: {
      FASTBALL: { name: "4-Seam Fastball", baseVelo: 93, range: 2, description: "Rising action" },
      SINKER: { name: "Sinker", baseVelo: 92, range: 2, description: "Heavy downward movement" },
      SLIDER: { name: "Slider", baseVelo: 83, range: 3, description: "Sharp late break" },
      CHANGEUP: { name: "Changeup", baseVelo: 84, range: 2, description: "Good fade" }
    }
  },
  "Cam Robinson": {
    name: "Cam Robinson",
    level: "AA Binghamton Rumble Ponies",
    pitches: {
      FASTBALL: { name: "4-Seam Fastball", baseVelo: 95, range: 2, description: "Power pitch with ride" },
      CURVEBALL: { name: "Curveball", baseVelo: 78, range: 3, description: "12-6 break" },
      SLIDER: { name: "Slider", baseVelo: 85, range: 3, description: "Tight spin" },
      CUTTER: { name: "Cutter", baseVelo: 90, range: 2, description: "Late movement" }
    }
  }
};

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

    <div className="mt-4">
      <h4 className="font-bold mb-2">Pitch Type Performance</h4>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(batter.pitchTypes).map(([type, value]) => (
          <div key={type} className="p-2 bg-gray-50 rounded">
            <div className="font-bold text-sm">{type}</div>
            <div>{value}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4">
      <h4 className="font-bold mb-2">Scouting Notes</h4>
      <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-2 rounded">
        {batter.notes}
      </pre>
    </div>
  </div>
);

const PitchSelection = ({ pitcher, onSelect }) => (
  <div className="grid grid-cols-2 gap-2 mb-4">
    {Object.entries(pitcher.pitches).map(([key, pitch]) => (
      <button
        key={key}
        onClick={() => onSelect(key)}
        className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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

const calculateOutcome = (pitch, location, batter, velocity, count) => {
  const outcomes = [
    { type: "SWING_MISS", probability: 0.3, description: "Swing and miss!" },
    { type: "FOUL", probability: 0.2, description: "Foul ball" },
    { type: "WEAK_CONTACT", probability: 0.2, description: "Weak contact - out!" },
    { type: "HARD_CONTACT", probability: 0.2, description: "Hard contact - hit!" },
    { type: "TAKE", probability: 0.1, description: "Takes the pitch" }
  ];

  const random = Math.random();
  let cumulativeProbability = 0;

  for (const outcome of outcomes) {
    cumulativeProbability += outcome.probability;
    if (random <= cumulativeProbability) {
      return outcome;
    }
  }
  return outcomes[0];
};

const getRandomVelocity = (pitch, fatigue) => {
  try {
    const fatigueEffect = Number((fatigue / 100) * 2);
    const baseVelo = Number(pitch.baseVelo) - fatigueEffect;
    const range = Number(pitch.range);
    const randomVariation = Math.random() * range;
    const finalVelocity = baseVelo - (range/2) + randomVariation;
    return String(Number(finalVelocity).toFixed(1));
  } catch (error) {
    console.error('Velocity calculation error:', error);
    return String(pitch.baseVelo);
  }
};

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
        newOuts++;
        newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
        newCount = { balls: 0, strikes: 0 };
        break;
      default:
        break;
    }

    if (newCount.strikes >= 3) {
      resultDescription = "Strikeout! ⚔️";
      newOuts++;
      newCount = { balls: 0, strikes: 0 };
      newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
    }

    if (newCount.balls >= 4) {
      resultDescription = "Walk! 🚶";
      newCount = { balls: 0, strikes: 0 };
      newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
    }

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
      velocity: velocity,
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

  if (!selectedPitcher) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Select Pitcher</h1>
        <div className="space-y-4">
          {Object.entries(PITCHERS).map(([key, pitcher]) => (
            <button
              key={key}
              onClick={() => setSelectedPitcher(pitcher)}
              className="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {pitcher.name} - {pitcher.level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pitcher Training Tool</h1>
        <div className="flex gap-4">
          <div>Count: {gameState.count.balls}-{gameState.count.strikes}</div>
          <div>Outs: {gameState.outs}</div>
          <div>Inning: {gameState.inning}</div>
        </div>
      </div>

      <div className="mb-4 bg-blue-50 p-2 rounded">
        <h2 className="font-bold">Now Batting:</h2>
        <p>{DODGERS_LINEUP[gameState.currentBatter].name} ({DODGERS_LINEUP[gameState.currentBatter].avg})</p>
        <p className="text-sm">Bats: {DODGERS_LINEUP[gameState.currentBatter].bats}</p>
      </div>

      <BatterAnalysis 
        batter={DODGERS_LINEUP[gameState.currentBatter]} 
      />

      {lastOutcome && (
        <div className="mb-4 p-2 bg-yellow-100 rounded">
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