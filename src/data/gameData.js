export const DODGERS_LINEUP = [
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
  
  export const PITCHERS = {
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