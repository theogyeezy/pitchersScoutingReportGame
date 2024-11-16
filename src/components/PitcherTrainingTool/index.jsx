import React, { useState } from 'react';

const ZONE_TYPES = {
  HEART: 'heart',
  EDGE: 'edge',
  CHASE: 'chase'
};

const DODGERS_LINEUP = [
  {
    name: "Mookie Betts",
    avg: ".307",
    bats: "R",
    slugging: ".579",
    ops: ".987",
    zones: {
      up_in: { avg: ".389", slug: ".789", whiff: "18%" },
      up_middle: { avg: ".312", slug: ".534", whiff: "22%" },
      up_away: { avg: ".312", slug: ".534", whiff: "22%" },
      middle_in: { avg: ".405", slug: ".811", whiff: "15%" },
      middle_middle: { avg: ".298", slug: ".498", whiff: "24%" },
      middle_away: { avg: ".298", slug: ".498", whiff: "24%" },
      down_in: { avg: ".245", slug: ".378", whiff: "28%" },
      down_middle: { avg: ".267", slug: ".401", whiff: "26%" },
      down_away: { avg: ".267", slug: ".401", whiff: "26%" },
      // Borderline zones
      borderline_up: { avg: ".280", slug: ".450", whiff: "25%" },
      borderline_in: { avg: ".275", slug: ".440", whiff: "26%" },
      borderline_away: { avg: ".270", slug: ".430", whiff: "27%" },
      borderline_down: { avg: ".265", slug: ".420", whiff: "28%" },
      // Chase zones
      chase_up: { avg: ".220", slug: ".380", whiff: "35%" },
      chase_in: { avg: ".210", slug: ".370", whiff: "36%" },
      chase_away: { avg: ".200", slug: ".360", whiff: "37%" },
      chase_down: { avg: ".190", slug: ".350", whiff: "38%" }
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
      up_in: { avg: ".256", slug: ".423", whiff: "25%" },
      up_middle: { avg: ".345", slug: ".678", whiff: "19%" },
      up_away: { avg: ".345", slug: ".678", whiff: "19%" },
      middle_in: { avg: ".356", slug: ".689", whiff: "17%" },
      middle_middle: { avg: ".398", slug: ".745", whiff: "16%" },
      middle_away: { avg: ".398", slug: ".745", whiff: "16%" },
      down_in: { avg: ".312", slug: ".534", whiff: "21%" },
      down_middle: { avg: ".289", slug: ".467", whiff: "23%" },
      down_away: { avg: ".289", slug: ".467", whiff: "23%" },
      // Borderline zones
      borderline_up: { avg: ".280", slug: ".450", whiff: "25%" },
      borderline_in: { avg: ".275", slug: ".440", whiff: "26%" },
      borderline_away: { avg: ".270", slug: ".430", whiff: "27%" },
      borderline_down: { avg: ".265", slug: ".420", whiff: "28%" },
      // Chase zones
      chase_up: { avg: ".220", slug: ".380", whiff: "35%" },
      chase_in: { avg: ".210", slug: ".370", whiff: "36%" },
      chase_away: { avg: ".200", slug: ".360", whiff: "37%" },
      chase_down: { avg: ".190", slug: ".350", whiff: "38%" }
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

const R2K_STRATEGIES = {
  "0-0": { expansion: "standard", priority: "Get ahead - Aim just off plate edges", r2k_boost: 1.0 },
  "0-1": { expansion: "aggressive", priority: "Expand zone - Chase opportunity", r2k_boost: 1.2 },
  "1-0": { expansion: "conservative", priority: "Command primary zone", r2k_boost: 0.8 },
  "0-2": { expansion: "maximum", priority: "Maximum zone expansion - Chase", r2k_boost: 1.5 },
  "2-0": { expansion: "minimal", priority: "Get strike - Minimize damage", r2k_boost: 0.6 },
  "1-1": { expansion: "standard", priority: "Quality strike or chase", r2k_boost: 1.0 },
  "1-2": { expansion: "aggressive", priority: "Expand zone - Chase opportunity", r2k_boost: 1.3 },
  "2-1": { expansion: "conservative", priority: "Quality strike location", r2k_boost: 0.8 },
  "2-2": { expansion: "standard", priority: "Competitive pitch - Edge play", r2k_boost: 1.0 },
  "3-0": { expansion: "minimal", priority: "Get strike - Minimize damage", r2k_boost: 0.5 },
  "3-1": { expansion: "minimal", priority: "Quality strike required", r2k_boost: 0.7 },
  "3-2": { expansion: "standard", priority: "Competitive pitch - Edge play", r2k_boost: 1.0 }
};

const StrikeZoneDisplay = ({ onSelectZone, batter, count }) => {
  const currentStrategy = R2K_STRATEGIES[`${count.balls}-${count.strikes}`] || R2K_STRATEGIES["0-0"];

  const getZoneStyle = (zoneType, stats, location) => {
    // Base style based on zone type
    const baseStyle = {
      [ZONE_TYPES.HEART]: parseFloat(stats.avg) > 0.300
        ? 'bg-white border border-red-300'
        : 'bg-white border border-gray-300',
      [ZONE_TYPES.EDGE]: 'bg-yellow-50 border border-yellow-200',
      [ZONE_TYPES.CHASE]: 'bg-blue-50 border border-blue-200'
    }[zoneType];

    // Add R2K highlight based on strategy
    const isExpandedZone = (zoneType === ZONE_TYPES.CHASE && currentStrategy.r2k_boost > 1.2) ||
      (zoneType === ZONE_TYPES.EDGE && currentStrategy.r2k_boost > 1.0);

    return `${baseStyle} ${isExpandedZone ? 'border-2 border-blue-400' : ''}`;
  };


  // const strategy = R2K_STRATEGIES[`${count.balls}-${count.strikes}`] || R2K_STRATEGIES["0-0"];

  const renderZone = (location, label, type, width = 'w-16 sm:w-24', height = 'h-16 sm:h-20') => {
    const stats = batter.zones[location] || { avg: ".000" };
    const isOptimalZone = (type === ZONE_TYPES.CHASE && currentStrategy.r2k_boost > 1.2) ||
      (type === ZONE_TYPES.EDGE && currentStrategy.r2k_boost > 1.0);

    return (
      <button
        onClick={() => onSelectZone(location)}
        className={`
          ${width} ${height} p-1 rounded relative transition
          hover:bg-opacity-80 flex flex-col justify-center items-center
          ${getZoneStyle(type, stats, location)}
        `}
      >
        <div className="text-[10px] sm:text-xs font-bold">{label}</div>
        <div className="text-[10px] sm:text-xs">{stats.avg}</div>
        {isOptimalZone && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] sm:text-xs px-1 rounded">
            R2K
          </div>
        )}
      </button>
    );
  };



  return (
    <div className="w-full max-w-full sm:max-w-3xl mx-auto p-2 sm:p-4">
      <div className="relative flex flex-col items-center">
        {/* Strategy Display */}
        <div className="mb-4 p-2 bg-blue-50 rounded w-full text-center">
          <p className="font-bold text-sm">R2K Strategy: {currentStrategy.expansion}</p>
          <p className="text-xs text-gray-600">{currentStrategy.priority}</p>
        </div>

        {/* Mobile-Optimized Strike Zone */}
        <div className="scale-[0.85] sm:scale-100 transform-gpu origin-top">
          {/* Chase High - Now spans full width */}
          <div className="mb-1 w-full flex justify-center">
            {renderZone(
              'chase_up',
              'High',
              ZONE_TYPES.CHASE,
              'w-[calc(100%-32px)] sm:w-[calc(100%-48px)]', // Spans width of core zone
              'h-8 sm:h-12'
            )}
          </div>

          {/* Main Grid Row */}
          <div className="flex justify-center items-center">
            {/* Chase Inside */}
            <div className="mr-1">
              {renderZone('chase_in', 'In', ZONE_TYPES.CHASE, 'w-8 sm:w-12', 'h-48 sm:h-60')}
            </div>

            {/* Border Inside */}
            <div className="mr-1">
              {renderZone('borderline_in', 'Edge', ZONE_TYPES.EDGE, 'w-6 sm:w-8', 'h-48 sm:h-60')}
            </div>

            {/* Core Strike Zone */}
            <div className="grid grid-cols-3 gap-px bg-gray-200 p-px">
              {[
                { loc: 'up_in', label: '1' },
                { loc: 'up_middle', label: '2' },
                { loc: 'up_away', label: '3' },
                { loc: 'middle_in', label: '4' },
                { loc: 'middle_middle', label: '5' },
                { loc: 'middle_away', label: '6' },
                { loc: 'down_in', label: '7' },
                { loc: 'down_middle', label: '8' },
                { loc: 'down_away', label: '9' }
              ].map((zone, idx) => (
                <div key={idx} className="w-16 sm:w-24 h-16 sm:h-20">
                  {renderZone(zone.loc, zone.label, ZONE_TYPES.HEART)}
                </div>
              ))}
            </div>

            {/* Border Outside */}
            <div className="ml-1">
              {renderZone('borderline_away', 'Edge', ZONE_TYPES.EDGE, 'w-6 sm:w-8', 'h-48 sm:h-60')}
            </div>

            {/* Chase Outside */}
            <div className="ml-1">
              {renderZone('chase_away', 'Out', ZONE_TYPES.CHASE, 'w-8 sm:w-12', 'h-48 sm:h-60')}
            </div>
          </div>

          {/* Chase Low - Now spans full width */}
          <div className="mt-1 w-full flex justify-center">
            {renderZone(
              'chase_down',
              'Low',
              ZONE_TYPES.CHASE,
              'w-[calc(100%-32px)] sm:w-[calc(100%-48px)]', // Spans width of core zone
              'h-8 sm:h-12'
            )}
          </div>
        </div>

        {/* Mobile-Optimized Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border border-gray-300 rounded"></div>
            <span>Strike</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span>Border</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Chase</span>
          </div>
          {currentStrategy.r2k_boost > 1.0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-400 rounded"></div>
              <span>R2K</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const BatterAnalysis = ({ batter }) => {
  const [showExpected, setShowExpected] = useState(false);

  return (
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
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Hot Zones</h4>
            <button
              onClick={() => setShowExpected(!showExpected)}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded transition"
            >
              Show {showExpected ? "AVG" : "Expected Stats"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Object.entries(batter.zones)
              .filter(([key]) => !key.includes('borderline') && !key.includes('chase'))
              .map(([zone, stats]) => (
                <div
                  key={zone}
                  className={`p-2 text-xs rounded ${parseFloat(stats.avg) > 0.300
                      ? 'bg-red-100'
                      : 'bg-green-100'
                    }`}
                >
                  <div className="font-bold">{zone.replace('_', ' ')}</div>
                  {showExpected ? (
                    <>
                      <div>SLG: {stats.slug}</div>
                      <div>Whiff: {stats.whiff}</div>
                    </>
                  ) : (
                    <div>AVG: {stats.avg}</div>
                  )}
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
};
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

const ZoneSelection = ({ batter, onSelect, count }) => (
  <div>
    <StrikeZoneDisplay
      batter={batter}
      onSelectZone={onSelect}
      count={count}
    />
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

const getRandomVelocity = (pitch, fatigue) => {
  try {
    const fatigueEffect = Number((fatigue / 100) * 2);
    const baseVelo = Number(pitch.baseVelo) - fatigueEffect;
    const range = Number(pitch.range);
    const randomVariation = Math.random() * range;
    const finalVelocity = baseVelo - (range / 2) + randomVariation;
    return String(Number(finalVelocity).toFixed(1));
  } catch (error) {
    console.error('Velocity calculation error:', error);
    return String(pitch.baseVelo);
  }
};

const calculateOutcome = (pitch, location, batter, velocity, count) => {
  const zoneStats = batter.zones[location];
  const battingAvg = parseFloat(zoneStats.avg);
  const slugging = parseFloat(zoneStats.slug);
  const whiffRate = parseInt(zoneStats.whiff) / 100;

  const [balls, strikes] = count.split('-').map(Number);
  const isHitterCount = balls > strikes;
  const isPitcherCount = strikes > balls;

  const isChaseZone = location.includes('chase');
  const isBorderlineZone = location.includes('borderline');

  let outcomes = [
    {
      type: "SWING_MISS",
      probability: whiffRate * (isPitcherCount ? 1.2 : 1) * (isChaseZone ? 1.5 : 1),
      description: "Swing and miss!"
    },
    {
      type: "FOUL",
      probability: 0.15 * (strikes === 2 ? 1.5 : 1) * (isBorderlineZone ? 1.3 : 1),
      description: "Foul ball"
    },
    {
      type: "WEAK_CONTACT",
      probability: (1 - battingAvg) * 0.4 * (isChaseZone ? 1.4 : 1),
      description: `Weak ${['grounder to short', 'pop-up to second', 'fly ball to left', 'chopper to third'][Math.floor(Math.random() * 4)]}`
    },
    {
      type: "HARD_CONTACT",
      probability: slugging * 0.3 * (isChaseZone ? 0.5 : isBorderlineZone ? 0.8 : 1),
      description: () => {
        if (Math.random() < slugging - 0.3 && !isChaseZone) {
          return "HOME RUN! Ball crushed to deep " + ['left', 'center', 'right'][Math.floor(Math.random() * 3)] + "!";
        }
        return `Hard ${['line drive', 'ground ball', 'fly ball'][Math.floor(Math.random() * 3)]}!`;
      }
    },
    {
      type: "TAKE",
      probability: (isChaseZone ? 0.4 : isBorderlineZone ? 0.2 : 0.1) * (isHitterCount ? 1.3 : 1),
      description: "Takes the pitch"
    }
  ];

  const total = outcomes.reduce((sum, o) => sum + o.probability, 0);
  outcomes.forEach(o => o.probability /= total);

  const random = Math.random();
  let cumulativeProbability = 0;

  for (const outcome of outcomes) {
    cumulativeProbability += outcome.probability;
    if (random <= cumulativeProbability) {
      return {
        ...outcome,
        description: typeof outcome.description === 'function'
          ? outcome.description()
          : outcome.description
      };
    }
  }

  return outcomes[0];
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
  const [r2kStats, setR2kStats] = useState({
    opportunities: 0,
    successful: 0,
    expanded_zones: 0
  });

  const updateGameState = (outcome, zone, pitch, velocity) => {
    let newCount = { ...gameState.count };
    let newOuts = gameState.outs;
    let newCurrentBatter = gameState.currentBatter;
    let resultDescription = outcome.description;

    // Remove this line since it's unused:
    // const strategy = R2K_STRATEGIES[`${gameState.count.balls}-${gameState.count.strikes}`] || R2K_STRATEGIES["0-0"];

    const isExpandedZone = zone.includes('chase') || zone.includes('borderline');

    if (isExpandedZone) {
      setR2kStats(prev => ({
        ...prev,
        opportunities: prev.opportunities + 1,
        successful: prev.successful + (outcome.type === 'SWING_MISS' || outcome.type === 'WEAK_CONTACT' ? 1 : 0),
        expanded_zones: prev.expanded_zones + 1
      }));
    }

    switch (outcome.type) {
      case 'SWING_MISS':
        newCount.strikes++;
        break;
      case 'FOUL':
        if (newCount.strikes < 2) newCount.strikes++;
        break;
      case 'TAKE':
        if (!zone.includes('chase') && !zone.includes('borderline')) {
          newCount.strikes++;
          resultDescription += " - Strike!";
        } else {
          newCount.balls++;
          resultDescription += " - Ball!";
        }
        break;
      case 'WEAK_CONTACT':
      case 'HARD_CONTACT':
        if (!resultDescription.includes('HOME RUN')) {
          newOuts++;
          newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
          newCount = { balls: 0, strikes: 0 };
        } else {
          newCurrentBatter = (newCurrentBatter + 1) % DODGERS_LINEUP.length;
          newCount = { balls: 0, strikes: 0 };
        }
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
      velocity,
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
          count={gameState.count}
        />
      )}

      {gameState.pitchHistory.length > 0 && (
        <PitchHistory history={gameState.pitchHistory} />
      )}

      {r2kStats.opportunities > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">R2K Performance</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">Success Rate</p>
              <p>{((r2kStats.successful / r2kStats.opportunities) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-semibold">Expanded Zones</p>
              <p>{r2kStats.expanded_zones}</p>
            </div>
            <div>
              <p className="font-semibold">Opportunities</p>
              <p>{r2kStats.opportunities}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitcherTrainingTool;