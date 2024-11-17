export const calculateOutcome = (pitch, location, batter, velocity, count) => {
    // Base probabilities
    const outcomes = [
      { type: "SWING_MISS", probability: 0.3, description: "Swing and miss!" },
      { type: "FOUL", probability: 0.2, description: "Foul ball" },
      { type: "WEAK_CONTACT", probability: 0.2, description: "Weak contact - out!" },
      { type: "HARD_CONTACT", probability: 0.2, description: "Hard contact - hit!" },
      { type: "TAKE", probability: 0.1, description: "Takes the pitch" }
    ];
  
    // Adjust probabilities based on batter stats and location
    const batterAvg = parseFloat(batter.zones[location]);
    outcomes.forEach(outcome => {
      if (outcome.type === "HARD_CONTACT") {
        outcome.probability *= batterAvg * 2;
      }
      if (outcome.type === "SWING_MISS") {
        outcome.probability *= (1 - batterAvg);
      }
    });
  
    // Select outcome based on adjusted probabilities
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
  
  export const getRandomVelocity = (pitch, fatigue) => {
    const fatigueEffect = (fatigue / 100) * 2;
    const baseVelo = pitch.baseVelo - fatigueEffect;
    const range = pitch.range;
    return (baseVelo - range/2 + Math.random() * range).toFixed(1);
  };