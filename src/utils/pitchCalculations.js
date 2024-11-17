const calculateOutcome = (pitch, location, batter, velocity, count) => {
  const zoneStats = batter.zones[location];
  const pitchTypeStats = batter.pitchTypes[getPitchType(pitch)];
  const [balls, strikes] = count.split('-').map(Number);
  const isAheadCount = strikes > balls;
  const isBehindCount = balls > strikes;

  // Base probabilities adjusted by batter stats
  const whiffRate = parseFloat(zoneStats.whiff.replace('%', '')) / 100;
  const chaseRate = parseFloat(zoneStats.chase.replace('%', '')) / 100;
  const battingAvg = parseFloat(zoneStats.avg);
  const slugging = parseFloat(zoneStats.slug);
  const pitchWhiffRate = parseFloat(pitchTypeStats.whiff.replace('%', '')) / 100;
  const pitchChaseRate = parseFloat(pitchTypeStats.chase.replace('%', '')) / 100;

  let outcomes = [];

  // Calculate situational adjustments
  const situationalMultiplier = getSituationalMultiplier(batter, count);

  // Determine if pitch is in a chase or borderline zone
  const isChaseZone = location.includes('chase');
  const isBorderlineZone = location.includes('borderline');

  // Build outcomes array with probabilities
  outcomes = [
    {
      type: "SWING_MISS",
      probability: calculateSwingAndMiss(whiffRate, pitchWhiffRate, isChaseZone, isAheadCount),
      description: "Swing and miss!"
    },
    {
      type: "FOUL",
      probability: calculateFoulBall(battingAvg, strikes, isBorderlineZone),
      description: "Foul ball"
    },
    {
      type: "WEAK_CONTACT",
      probability: calculateWeakContact(battingAvg, isChaseZone, velocity),
      description: getWeakContactDescription()
    },
    {
      type: "HARD_CONTACT",
      probability: calculateHardContact(slugging, isChaseZone, velocity),
      description: getHardContactDescription(slugging, isChaseZone)
    },
    {
      type: "TAKE",
      probability: calculateTake(chaseRate, pitchChaseRate, isChaseZone, count),
      description: getTakeDescription(location)
    }
  ];

  // Normalize probabilities
  const total = outcomes.reduce((sum, o) => sum + o.probability, 0);
  outcomes.forEach(o => o.probability = (o.probability / total) * situationalMultiplier);

  // Select outcome based on probabilities
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

// Helper functions for outcome calculations
const calculateSwingAndMiss = (zoneWhiff, pitchWhiff, isChaseZone, isAheadCount) => {
  let probability = (zoneWhiff + pitchWhiff) / 2;
  if (isChaseZone) probability *= 1.3;
  if (isAheadCount) probability *= 1.2;
  return probability;
};

const calculateFoulBall = (battingAvg, strikes, isBorderlineZone) => {
  let probability = 0.2 + (battingAvg * 0.3);
  if (strikes === 2) probability *= 1.4;
  if (isBorderlineZone) probability *= 1.2;
  return probability;
};

const calculateWeakContact = (battingAvg, isChaseZone, velocity) => {
  let probability = (1 - battingAvg) * 0.4;
  if (isChaseZone) probability *= 1.3;
  if (velocity > 95) probability *= 1.2;
  return probability;
};

const calculateHardContact = (slugging, isChaseZone, velocity) => {
  let probability = slugging * 0.3;
  if (isChaseZone) probability *= 0.5;
  if (velocity < 90) probability *= 1.2;
  return probability;
};

const calculateTake = (zoneChase, pitchChase, isChaseZone, count) => {
  const [balls, strikes] = count.split('-').map(Number);
  let probability = 1 - ((zoneChase + pitchChase) / 2);
  if (isChaseZone) probability *= 1.3;
  if (balls > strikes) probability *= 1.2;
  if (strikes === 2) probability *= 0.7;
  return probability;
};

// Situational adjustments
const getSituationalMultiplier = (batter, count) => {
  const [balls, strikes] = count.split('-').map(Number);
  if (strikes === 2) {
    return parseFloat(batter.situational.behind_count.avg) / parseFloat(batter.overall.avg);
  }
  if (balls > strikes) {
    return parseFloat(batter.situational.ahead_count.avg) / parseFloat(batter.overall.avg);
  }
  return 1;
};

// Outcome descriptions
const getWeakContactDescription = () => {
  const descriptions = [
    "Weak grounder to short",
    "Soft pop-up to second",
    "Routine flyout to left",
    "Slow roller to third",
    "Easy chopper to first",
    "Lazy fly ball to center"
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getHardContactDescription = (slugging, isChaseZone) => {
  if (!isChaseZone && Math.random() < (slugging - 0.3)) {
    const directions = ["left", "center", "right"];
    return `HOME RUN! Ball crushed to deep ${directions[Math.floor(Math.random() * 3)]}!`;
  }

  const descriptions = [
    "Sharp line drive!",
    "Deep drive to the wall!",
    "Hard grounder through the hole!",
    "Rocket to the gap!",
    "Screaming liner!",
    "Crushed to deep center!"
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getTakeDescription = (location) => {
  const isStrike = !location.includes('chase');
  return `Takes the pitch - ${isStrike ? 'Strike!' : 'Ball!'}`;
};

export { calculateOutcome };