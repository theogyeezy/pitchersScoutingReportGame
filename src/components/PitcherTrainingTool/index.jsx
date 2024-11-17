import React, { useState, useEffect } from 'react';

const ZONE_TYPES = {
  HEART: 'heart',
  EDGE: 'edge',
  CHASE: 'chase'
};

// const DODGERS_LINEUP = [
//   {
//     name: "Mookie Betts",
//     avg: ".307",
//     bats: "R",
//     slugging: ".579",
//     ops: ".987",
//     zones: {
//       up_in: { avg: ".389", slug: ".789", whiff: "18%" },
//       up_middle: { avg: ".312", slug: ".534", whiff: "22%" },
//       up_away: { avg: ".312", slug: ".534", whiff: "22%" },
//       middle_in: { avg: ".405", slug: ".811", whiff: "15%" },
//       middle_middle: { avg: ".298", slug: ".498", whiff: "24%" },
//       middle_away: { avg: ".298", slug: ".498", whiff: "24%" },
//       down_in: { avg: ".245", slug: ".378", whiff: "28%" },
//       down_middle: { avg: ".267", slug: ".401", whiff: "26%" },
//       down_away: { avg: ".267", slug: ".401", whiff: "26%" },
//       // Borderline zones
//       borderline_up: { avg: ".280", slug: ".450", whiff: "25%" },
//       borderline_in: { avg: ".275", slug: ".440", whiff: "26%" },
//       borderline_away: { avg: ".270", slug: ".430", whiff: "27%" },
//       borderline_down: { avg: ".265", slug: ".420", whiff: "28%" },
//       // Chase zones
//       chase_up: { avg: ".220", slug: ".380", whiff: "35%" },
//       chase_in: { avg: ".210", slug: ".370", whiff: "36%" },
//       chase_away: { avg: ".200", slug: ".360", whiff: "37%" },
//       chase_down: { avg: ".190", slug: ".350", whiff: "38%" }
//     },
//     pitchTypes: {
//       fastball: ".345",
//       breaking: ".289",
//       offspeed: ".301"
//     },
//     notes: "- Elite against velocity\n- Handles high pitches well\n- Will chase breaking balls down and away\n- Aggressive early in count"
//   },
//   {
//     name: "Freddie Freeman",
//     avg: ".331",
//     bats: "L",
//     slugging: ".567",
//     ops: ".976",
//     zones: {
//       up_in: { avg: ".256", slug: ".423", whiff: "25%" },
//       up_middle: { avg: ".345", slug: ".678", whiff: "19%" },
//       up_away: { avg: ".345", slug: ".678", whiff: "19%" },
//       middle_in: { avg: ".356", slug: ".689", whiff: "17%" },
//       middle_middle: { avg: ".398", slug: ".745", whiff: "16%" },
//       middle_away: { avg: ".398", slug: ".745", whiff: "16%" },
//       down_in: { avg: ".312", slug: ".534", whiff: "21%" },
//       down_middle: { avg: ".289", slug: ".467", whiff: "23%" },
//       down_away: { avg: ".289", slug: ".467", whiff: "23%" },
//       // Borderline zones
//       borderline_up: { avg: ".280", slug: ".450", whiff: "25%" },
//       borderline_in: { avg: ".275", slug: ".440", whiff: "26%" },
//       borderline_away: { avg: ".270", slug: ".430", whiff: "27%" },
//       borderline_down: { avg: ".265", slug: ".420", whiff: "28%" },
//       // Chase zones
//       chase_up: { avg: ".220", slug: ".380", whiff: "35%" },
//       chase_in: { avg: ".210", slug: ".370", whiff: "36%" },
//       chase_away: { avg: ".200", slug: ".360", whiff: "37%" },
//       chase_down: { avg: ".190", slug: ".350", whiff: "38%" }
//     },
//     pitchTypes: {
//       fastball: ".356",
//       breaking: ".325",
//       offspeed: ".267"
//     },
//     notes: "- Excellent plate coverage\n- Struggles with changeups from RHP\n- Rarely chases out of zone\n- Better against velocity than breaking balls"
//   }
// ];

const SEADOGS_LINEUP = [
  {
    name: "Phillip Sikes",
    position: "CF",
    bats: "R",
    overall: {
      avg: ".265",
      obp: ".358",
      slg: ".421",
      ops: ".779",
      hr: 13,
      rbi: 54,
      sb: 29
    },
    splits: {
      vs_right: { avg: ".258", obp: ".349", slg: ".408", ops: ".757" },
      vs_left: { avg: ".282", obp: ".377", slg: ".451", ops: ".828" }
    },
    pitchTypes: {
      fastball: { avg: ".275", slug: ".445", whiff: "18%", chase: "22%" },
      slider: { avg: ".231", slug: ".378", whiff: "32%", chase: "28%" },
      curveball: { avg: ".245", slug: ".389", whiff: "27%", chase: "25%" },
      changeup: { avg: ".238", slug: ".367", whiff: "30%", chase: "31%" }
    },
    zones: {
      up_in: { avg: ".278", slug: ".389", whiff: "22%", chase: "24%" },
      up_middle: { avg: ".301", slug: ".534", whiff: "18%", chase: "20%" },
      up_away: { avg: ".256", slug: ".401", whiff: "24%", chase: "26%" },
      middle_in: { avg: ".289", slug: ".478", whiff: "20%", chase: "22%" },
      middle_middle: { avg: ".312", slug: ".567", whiff: "16%", chase: "18%" },
      middle_away: { avg: ".245", slug: ".389", whiff: "25%", chase: "27%" },
      down_in: { avg: ".234", slug: ".378", whiff: "27%", chase: "29%" },
      down_middle: { avg: ".267", slug: ".423", whiff: "23%", chase: "25%" },
      down_away: { avg: ".223", slug: ".345", whiff: "28%", chase: "30%" },
      // Chase and borderline zones
      chase_up: { avg: ".189", slug: ".278", whiff: "45%", chase: "32%" },
      chase_in: { avg: ".178", slug: ".267", whiff: "47%", chase: "28%" },
      chase_away: { avg: ".165", slug: ".245", whiff: "49%", chase: "35%" },
      chase_down: { avg: ".156", slug: ".234", whiff: "51%", chase: "38%" },
      borderline_up: { avg: ".234", slug: ".345", whiff: "35%", chase: "27%" },
      borderline_in: { avg: ".245", slug: ".367", whiff: "33%", chase: "25%" },
      borderline_away: { avg: ".223", slug: ".334", whiff: "37%", chase: "29%" },
      borderline_down: { avg: ".212", slug: ".323", whiff: "39%", chase: "31%" }
    },
    situational: {
      risp: { avg: ".283", obp: ".375", slg: ".456", ops: ".831" },
      risp_2out: { avg: ".267", obp: ".359", slg: ".434", ops: ".793" },
      late_close: { avg: ".255", obp: ".348", slg: ".412", ops: ".760" },
      ahead_count: { avg: ".301", obp: ".512", slg: ".489", ops: "1.001" },
      behind_count: { avg: ".221", obp: ".267", slg: ".334", ops: ".601" }
    },
    notes: "- Aggressive early in count\n- Strong vs LHP\n- Chase tendency on breaking balls away\n- High success rate stealing bases\n- Improved power numbers late season"
  },
  {
    name: "Alex Binelas",
    position: "1B",
    bats: "L",
    overall: {
      avg: ".245",
      obp: ".343",
      slg: ".463",
      ops: ".806",
      hr: 21,
      rbi: 67,
      sb: 5
    },
    splits: {
      vs_right: { avg: ".256", obp: ".355", slg: ".489", ops: ".844" },
      vs_left: { avg: ".219", obp: ".312", slg: ".401", ops: ".713" }
    },
    pitchTypes: {
      fastball: { avg: ".267", slug: ".523", whiff: "22%", chase: "24%" },
      slider: { avg: ".198", slug: ".345", whiff: "38%", chase: "32%" },
      curveball: { avg: ".223", slug: ".378", whiff: "35%", chase: "29%" },
      changeup: { avg: ".245", slug: ".412", whiff: "28%", chase: "26%" }
    },
    zones: {
      up_in: { avg: ".267", slug: ".489", whiff: "25%", chase: "27%" },
      up_middle: { avg: ".245", slug: ".467", whiff: "28%", chase: "29%" },
      up_away: { avg: ".212", slug: ".389", whiff: "35%", chase: "33%" },
      middle_in: { avg: ".289", slug: ".534", whiff: "22%", chase: "24%" },
      middle_middle: { avg: ".278", slug: ".512", whiff: "24%", chase: "25%" },
      middle_away: { avg: ".234", slug: ".423", whiff: "32%", chase: "30%" },
      down_in: { avg: ".256", slug: ".478", whiff: "26%", chase: "28%" },
      down_middle: { avg: ".245", slug: ".445", whiff: "29%", chase: "31%" },
      down_away: { avg: ".198", slug: ".356", whiff: "38%", chase: "36%" },
      chase_up: { avg: ".167", slug: ".289", whiff: "48%", chase: "35%" },
      chase_in: { avg: ".189", slug: ".312", whiff: "45%", chase: "32%" },
      chase_away: { avg: ".145", slug: ".245", whiff: "52%", chase: "38%" },
      chase_down: { avg: ".156", slug: ".267", whiff: "50%", chase: "37%" },
      borderline_up: { avg: ".223", slug: ".378", whiff: "38%", chase: "30%" },
      borderline_in: { avg: ".245", slug: ".412", whiff: "35%", chase: "28%" },
      borderline_away: { avg: ".189", slug: ".334", whiff: "42%", chase: "33%" },
      borderline_down: { avg: ".212", slug: ".367", whiff: "40%", chase: "31%" }
    },
    situational: {
      risp: { avg: ".256", obp: ".367", slg: ".489", ops: ".856" },
      risp_2out: { avg: ".234", obp: ".345", slg: ".456", ops: ".801" },
      late_close: { avg: ".245", obp: ".356", slg: ".467", ops: ".823" },
      ahead_count: { avg: ".289", obp: ".478", slg: ".534", ops: "1.012" },
      behind_count: { avg: ".198", obp: ".234", slg: ".345", ops: ".579" }
    },
    notes: "- Power-hitting lefty\n- Strong vs RHP, struggles vs LHP\n- High chase rate on sliders away\n- Pull-heavy approach\n- Elevated FB weakness"
  },
  {
    name: "Nathan Hickey",
    position: "C",
    bats: "L",
    overall: {
      avg: ".263",
      obp: ".371",
      slg: ".476",
      ops: ".847",
      hr: 19,
      rbi: 64,
      sb: 1
    },
    splits: {
      vs_right: { avg: ".278", obp: ".389", slg: ".501", ops: ".890" },
      vs_left: { avg: ".234", obp: ".334", slg: ".412", ops: ".746" }
    },
    pitchTypes: {
      fastball: { avg: ".289", slug: ".534", whiff: "19%", chase: "22%" },
      slider: { avg: ".223", slug: ".389", whiff: "35%", chase: "30%" },
      curveball: { avg: ".245", slug: ".423", whiff: "32%", chase: "28%" },
      changeup: { avg: ".256", slug: ".445", whiff: "27%", chase: "25%" }
    },
    zones: {
      up_in: { avg: ".278", slug: ".512", whiff: "23%", chase: "25%" },
      up_middle: { avg: ".256", slug: ".478", whiff: "26%", chase: "27%" },
      up_away: { avg: ".223", slug: ".401", whiff: "33%", chase: "31%" },
      middle_in: { avg: ".301", slug: ".567", whiff: "20%", chase: "22%" },
      middle_middle: { avg: ".289", slug: ".534", whiff: "22%", chase: "24%" },
      middle_away: { avg: ".245", slug: ".434", whiff: "30%", chase: "28%" },
      down_in: { avg: ".267", slug: ".489", whiff: "25%", chase: "26%" },
      down_middle: { avg: ".256", slug: ".467", whiff: "27%", chase: "28%" },
      down_away: { avg: ".212", slug: ".378", whiff: "36%", chase: "33%" },
      chase_up: { avg: ".178", slug: ".301", whiff: "46%", chase: "34%" },
      chase_in: { avg: ".198", slug: ".334", whiff: "43%", chase: "31%" },
      chase_away: { avg: ".156", slug: ".267", whiff: "50%", chase: "37%" },
      chase_down: { avg: ".167", slug: ".289", whiff: "48%", chase: "35%" },
      borderline_up: { avg: ".234", slug: ".401", whiff: "36%", chase: "29%" },
      borderline_in: { avg: ".256", slug: ".445", whiff: "33%", chase: "27%" },
      borderline_away: { avg: ".201", slug: ".356", whiff: "40%", chase: "32%" },
      borderline_down: { avg: ".223", slug: ".389", whiff: "38%", chase: "30%" }
    },
    situational: {
      risp: { avg: ".278", obp: ".389", slg: ".501", ops: ".890" },
      risp_2out: { avg: ".256", obp: ".367", slg: ".478", ops: ".845" },
      late_close: { avg: ".245", obp: ".356", slg: ".445", ops: ".801" },
      ahead_count: { avg: ".301", obp: ".489", slg: ".567", ops: "1.056" },
      behind_count: { avg: ".212", obp: ".245", slg: ".367", ops: ".612" }
    },
    notes: "- Patient approach\n- Power to all fields\n- Strong vs RHP\n- Handles breaking balls well\n- Good situational hitter"
  },
  {
    name: "Chase Meidroth",
    position: "2B",
    bats: "R",
    overall: {
      avg: ".282",
      obp: ".397",
      slg: ".439",
      ops: ".836",
      hr: 11,
      rbi: 49,
      sb: 8
    },
    splits: {
      vs_right: { avg: ".276", obp: ".389", slg: ".434", ops: ".823" },
      vs_left: { avg: ".295", obp: ".412", slg: ".451", ops: ".863" }
    },
    pitchTypes: {
      fastball: { avg: ".301", slug: ".478", whiff: "16%", chase: "20%" },
      slider: { avg: ".256", slug: ".412", whiff: "28%", chase: "25%" },
      curveball: { avg: ".267", slug: ".423", whiff: "25%", chase: "23%" },
      changeup: { avg: ".245", slug: ".389", whiff: "27%", chase: "24%" }
    },
    zones: {
      up_in: { avg: ".267", slug: ".423", whiff: "24%", chase: "26%" },
      up_middle: { avg: ".289", slug: ".456", whiff: "21%", chase: "23%" },
      up_away: { avg: ".245", slug: ".389", whiff: "28%", chase: "29%" },
      middle_in: { avg: ".312", slug: ".534", whiff: "18%", chase: "21%" },
      middle_middle: { avg: ".301", slug: ".501", whiff: "19%", chase: "22%" },
      middle_away: { avg: ".267", slug: ".434", whiff: "25%", chase: "26%" },
      down_in: { avg: ".278", slug: ".445", whiff: "23%", chase: "24%" },
      down_middle: { avg: ".289", slug: ".467", whiff: "22%", chase: "23%" },
      down_away: { avg: ".234", slug: ".378", whiff: "29%", chase: "30%" },
      chase_up: { avg: ".189", slug: ".312", whiff: "42%", chase: "31%" },
      chase_in: { avg: ".201", slug: ".334", whiff: "40%", chase: "29%" },
      chase_away: { avg: ".167", slug: ".278", whiff: "45%", chase: "33%" },
      chase_down: { avg: ".178", slug: ".301", whiff: "43%", chase: "32%" },
      borderline_up: { avg: ".245", slug: ".401", whiff: "32%", chase: "27%" },
      borderline_in: { avg: ".267", slug: ".434", whiff: "29%", chase: "25%" },
      borderline_away: { avg: ".223", slug: ".367", whiff: "34%", chase: "28%" },
      borderline_down: { avg: ".234", slug: ".389", whiff: "33%", chase: "27%" }
    },
    situational: {
      risp: { avg: ".295", obp: ".412", slg: ".467", ops: ".879" },
      risp_2out: { avg: ".278", obp: ".389", slg: ".445", ops: ".834" },
      late_close: { avg: ".267", obp: ".378", slg: ".434", ops: ".812" },
      ahead_count: { avg: ".312", obp: ".501", slg: ".534", ops: "1.035" },
      behind_count: { avg: ".234", obp: ".267", slg: ".378", ops: ".645" }
    },
    notes: "- Contact-oriented approach\n- Low chase rate\n- Strong plate discipline\n- Good situational hitter\n- Handles both RHP and LHP well"
  },
  {
    name: "Matthew Lugo",
    position: "SS",
    bats: "R",
    overall: {
      avg: ".288",
      obp: ".337",
      slg: ".469",
      ops: ".806",
      hr: 16,
      rbi: 71,
      sb: 20
    },
    splits: {
      vs_right: { avg: ".282", obp: ".331", slg: ".458", ops: ".789" },
      vs_left: { avg: ".301", obp: ".349", slg: ".491", ops: ".840" }
    },
    pitchTypes: {
      fastball: { avg: ".301", slug: ".512", whiff: "18%", chase: "23%" },
      slider: { avg: ".245", slug: ".401", whiff: "32%", chase: "28%" },
      curveball: { avg: ".256", slug: ".423", whiff: "29%", chase: "26%" },
      changeup: { avg: ".267", slug: ".445", whiff: "25%", chase: "24%" }
    },
    zones: {
      up_in: { avg: ".278", slug: ".467", whiff: "23%", chase: "25%" },
      up_middle: { avg: ".289", slug: ".489", whiff: "21%", chase: "24%" },
      up_away: { avg: ".256", slug: ".423", whiff: "27%", chase: "29%" },
      middle_in: { avg: ".301", slug: ".523", whiff: "19%", chase: "22%" },
      middle_middle: { avg: ".312", slug: ".534", whiff: "18%", chase: "21%" },
      middle_away: { avg: ".267", slug: ".445", whiff: "24%", chase: "26%" },
      down_in: { avg: ".289", slug: ".478", whiff: "22%", chase: "24%" },
      down_middle: { avg: ".278", slug: ".456", whiff: "23%", chase: "25%" },
      down_away: { avg: ".245", slug: ".401", whiff: "28%", chase: "30%" },
      chase_up: { avg: ".189", slug: ".312", whiff: "43%", chase: "32%" },
      chase_in: { avg: ".201", slug: ".334", whiff: "41%", chase: "30%" },
      chase_away: { avg: ".167", slug: ".289", whiff: "46%", chase: "34%" },
      chase_down: { avg: ".178", slug: ".301", whiff: "44%", chase: "33%" },
      borderline_up: { avg: ".245", slug: ".412", whiff: "33%", chase: "28%" },
      borderline_in: { avg: ".267", slug: ".445", whiff: "30%", chase: "26%" },
      borderline_away: { avg: ".234", slug: ".389", whiff: "35%", chase: "29%" },
      borderline_down: { avg: ".256", slug: ".423", whiff: "32%", chase: "27%" }
    },
    situational: {
      risp: { avg: ".301", obp: ".349", slg: ".489", ops: ".838" },
      risp_2out: { avg: ".278", obp: ".331", slg: ".456", ops: ".787" },
      late_close: { avg: ".267", obp: ".319", slg: ".445", ops: ".764" },
      ahead_count: { avg: ".323", obp: ".467", slg: ".545", ops: "1.012" },
      behind_count: { avg: ".234", obp: ".256", slg: ".389", ops: ".645" }
    },
    notes: "- Aggressive early in count\n- Good speed on bases\n- Strong vs LHP\n- Pull tendency on inner half\n- Improved power numbers"
  }, 
  {
    name: "Matthew Lugo",
    position: "SS",
    bats: "R",
    overall: {
      avg: ".288",
      obp: ".337",
      slg: ".469",
      ops: ".806",
      hr: 16,
      rbi: 71,
      sb: 20
    },
    splits: {
      vs_right: { avg: ".282", obp: ".331", slg: ".458", ops: ".789" },
      vs_left: { avg: ".301", obp: ".349", slg: ".491", ops: ".840" }
    },
    pitchTypes: {
      fastball: { avg: ".301", slug: ".512", whiff: "18%", chase: "23%" },
      slider: { avg: ".245", slug: ".401", whiff: "32%", chase: "28%" },
      curveball: { avg: ".256", slug: ".423", whiff: "29%", chase: "26%" },
      changeup: { avg: ".267", slug: ".445", whiff: "25%", chase: "24%" }
    },
    zones: {
      up_in: { avg: ".278", slug: ".467", whiff: "23%", chase: "25%" },
      up_middle: { avg: ".289", slug: ".489", whiff: "21%", chase: "24%" },
      up_away: { avg: ".256", slug: ".423", whiff: "27%", chase: "29%" },
      middle_in: { avg: ".301", slug: ".523", whiff: "19%", chase: "22%" },
      middle_middle: { avg: ".312", slug: ".534", whiff: "18%", chase: "21%" },
      middle_away: { avg: ".267", slug: ".445", whiff: "24%", chase: "26%" },
      down_in: { avg: ".289", slug: ".478", whiff: "22%", chase: "24%" },
      down_middle: { avg: ".278", slug: ".456", whiff: "23%", chase: "25%" },
      down_away: { avg: ".245", slug: ".401", whiff: "28%", chase: "30%" },
      chase_up: { avg: ".189", slug: ".312", whiff: "43%", chase: "32%" },
      chase_in: { avg: ".201", slug: ".334", whiff: "41%", chase: "30%" },
      chase_away: { avg: ".167", slug: ".289", whiff: "46%", chase: "34%" },
      chase_down: { avg: ".178", slug: ".301", whiff: "44%", chase: "33%" },
      borderline_up: { avg: ".245", slug: ".412", whiff: "33%", chase: "28%" },
      borderline_in: { avg: ".267", slug: ".445", whiff: "30%", chase: "26%" },
      borderline_away: { avg: ".234", slug: ".389", whiff: "35%", chase: "29%" },
      borderline_down: { avg: ".256", slug: ".423", whiff: "32%", chase: "27%" }
    },
    situational: {
      risp: { avg: ".301", obp: ".349", slg: ".489", ops: ".838" },
      risp_2out: { avg: ".278", obp: ".331", slg: ".456", ops: ".787" },
      late_close: { avg: ".267", obp: ".319", slg: ".445", ops: ".764" },
      ahead_count: { avg: ".323", obp: ".467", slg: ".545", ops: "1.012" },
      behind_count: { avg: ".234", obp: ".256", slg: ".389", ops: ".645" }
    },
    notes: "- Aggressive early in count\n- Good speed on bases\n- Strong vs LHP\n- Pull tendency on inner half\n- Improved power numbers"
  },
   {
    name: "Tyler McDonough",
    position: "RF",
    bats: "S",
    overall: {
      avg: ".276",
      obp: ".351",
      slg: ".455",
      ops: ".806",
      hr: 14,
      rbi: 58,
      sb: 25
    },
    splits: {
      vs_right: { avg: ".281", obp: ".358", slg: ".467", ops: ".825" },
      vs_left: { avg: ".265", obp: ".335", slg: ".431", ops: ".766" }
    },
    pitchTypes: {
      fastball: { avg: ".295", slug: ".489", whiff: "19%", chase: "23%" },
      slider: { avg: ".243", slug: ".398", whiff: "31%", chase: "27%" },
      curveball: { avg: ".259", slug: ".421", whiff: "28%", chase: "25%" },
      changeup: { avg: ".251", slug: ".412", whiff: "26%", chase: "24%" }
    },
    zones: {
      up_in: { avg: ".271", slug: ".456", whiff: "24%", chase: "26%" },
      up_middle: { avg: ".285", slug: ".478", whiff: "22%", chase: "24%" },
      up_away: { avg: ".249", slug: ".412", whiff: "28%", chase: "29%" },
      middle_in: { avg: ".291", slug: ".501", whiff: "20%", chase: "23%" },
      middle_middle: { avg: ".305", slug: ".523", whiff: "19%", chase: "22%" },
      middle_away: { avg: ".265", slug: ".445", whiff: "25%", chase: "27%" },
      down_in: { avg: ".281", slug: ".467", whiff: "23%", chase: "25%" },
      down_middle: { avg: ".275", slug: ".459", whiff: "24%", chase: "26%" },
      down_away: { avg: ".241", slug: ".389", whiff: "29%", chase: "31%" },
      chase_up: { avg: ".185", slug: ".301", whiff: "44%", chase: "33%" },
      chase_in: { avg: ".195", slug: ".321", whiff: "42%", chase: "31%" },
      chase_away: { avg: ".165", slug: ".278", whiff: "47%", chase: "35%" },
      chase_down: { avg: ".175", slug: ".289", whiff: "45%", chase: "34%" },
      borderline_up: { avg: ".241", slug: ".401", whiff: "34%", chase: "29%" },
      borderline_in: { avg: ".261", slug: ".432", whiff: "31%", chase: "27%" },
      borderline_away: { avg: ".231", slug: ".378", whiff: "36%", chase: "30%" },
      borderline_down: { avg: ".251", slug: ".412", whiff: "33%", chase: "28%" }
    },
    situational: {
      risp: { avg: ".289", obp: ".365", slg: ".478", ops: ".843" },
      risp_2out: { avg: ".271", obp: ".345", slg: ".445", ops: ".790" },
      late_close: { avg: ".261", obp: ".335", slg: ".432", ops: ".767" },
      ahead_count: { avg: ".315", obp: ".455", slg: ".534", ops: ".989" },
      behind_count: { avg: ".231", obp: ".251", slg: ".378", ops: ".629" }
    },
    notes: "- Switch hitter with gap power\n- Above average speed\n- Better from right side\n- Good bunter\n- Versatile defender"
  },
  {
    name: "Nick Yorke",
    position: "3B",
    bats: "R",
    overall: {
      avg: ".295",
      obp: ".381",
      slg: ".473",
      ops: ".854",
      hr: 15,
      rbi: 63,
      sb: 12
    },
    splits: {
      vs_right: { avg: ".289", obp: ".375", slg: ".465", ops: ".840" },
      vs_left: { avg: ".309", obp: ".395", slg: ".491", ops: ".886" }
    },
    pitchTypes: {
      fastball: { avg: ".315", slug: ".534", whiff: "16%", chase: "21%" },
      slider: { avg: ".265", slug: ".423", whiff: "29%", chase: "25%" },
      curveball: { avg: ".275", slug: ".445", whiff: "26%", chase: "23%" },
      changeup: { avg: ".255", slug: ".401", whiff: "28%", chase: "24%" }
    },
    zones: {
      up_in: { avg: ".285", slug: ".478", whiff: "22%", chase: "24%" },
      up_middle: { avg: ".301", slug: ".501", whiff: "20%", chase: "22%" },
      up_away: { avg: ".265", slug: ".432", whiff: "26%", chase: "28%" },
      middle_in: { avg: ".315", slug: ".545", whiff: "18%", chase: "20%" },
      middle_middle: { avg: ".325", slug: ".556", whiff: "17%", chase: "19%" },
      middle_away: { avg: ".275", slug: ".456", whiff: "23%", chase: "25%" },
      down_in: { avg: ".295", slug: ".489", whiff: "21%", chase: "23%" },
      down_middle: { avg: ".285", slug: ".467", whiff: "22%", chase: "24%" },
      down_away: { avg: ".255", slug: ".412", whiff: "27%", chase: "29%" },
      chase_up: { avg: ".195", slug: ".321", whiff: "42%", chase: "31%" },
      chase_in: { avg: ".205", slug: ".345", whiff: "40%", chase: "29%" },
      chase_away: { avg: ".175", slug: ".298", whiff: "45%", chase: "33%" },
      chase_down: { avg: ".185", slug: ".312", whiff: "43%", chase: "32%" },
      borderline_up: { avg: ".255", slug: ".423", whiff: "32%", chase: "27%" },
      borderline_in: { avg: ".275", slug: ".456", whiff: "29%", chase: "25%" },
      borderline_away: { avg: ".245", slug: ".401", whiff: "34%", chase: "28%" },
      borderline_down: { avg: ".265", slug: ".434", whiff: "31%", chase: "26%" }
    },
    situational: {
      risp: { avg: ".312", obp: ".401", slg: ".501", ops: ".902" },
      risp_2out: { avg: ".289", obp: ".375", slg: ".478", ops: ".853" },
      late_close: { avg: ".275", obp: ".365", slg: ".445", ops: ".810" },
      ahead_count: { avg: ".335", obp: ".512", slg: ".567", ops: "1.079" },
      behind_count: { avg: ".245", obp: ".275", slg: ".389", ops: ".664" }
    },
    notes: "- Advanced approach at plate\n- Strong zone control\n- Handles both RHP/LHP well\n- Clutch performer\n- Improved power development"
  }
];


// const PITCHERS = {
//   "Jordan Geber": {
//     name: "Jordan Geber",
//     level: "AAA Syracuse Mets",
//     pitches: {
//       FASTBALL: { name: "4-Seam Fastball", baseVelo: 93, range: 2, description: "Rising action" },
//       SINKER: { name: "Sinker", baseVelo: 92, range: 2, description: "Heavy downward movement" },
//       SLIDER: { name: "Slider", baseVelo: 83, range: 3, description: "Sharp late break" },
//       CHANGEUP: { name: "Changeup", baseVelo: 84, range: 2, description: "Good fade" }
//     }
//   },
//   "Cam Robinson": {
//     name: "Cam Robinson",
//     level: "AA Binghamton Rumble Ponies",
//     pitches: {
//       FASTBALL: { name: "4-Seam Fastball", baseVelo: 95, range: 2, description: "Power pitch with ride" },
//       CURVEBALL: { name: "Curveball", baseVelo: 78, range: 3, description: "12-6 break" },
//       SLIDER: { name: "Slider", baseVelo: 85, range: 3, description: "Tight spin" },
//       CUTTER: { name: "Cutter", baseVelo: 90, range: 2, description: "Late movement" }
//     }
//   }
// };

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

// StrikeZoneDisplay component update first (since it's most complex with new stats)
const StrikeZoneDisplay = ({ onSelectZone, batter, count }) => {
  const currentStrategy = R2K_STRATEGIES[`${count.balls}-${count.strikes}`] || R2K_STRATEGIES["0-0"];
  const [showStat, setShowStat] = useState('avg'); // Toggle between avg/slug/whiff/chase

  // Advanced zone style calculation
  const getZoneStyle = (zoneStats, zoneType) => {
    const value = parseFloat(zoneStats[showStat]);
    const baseStyle = {
      [ZONE_TYPES.HEART]: value > (showStat === 'avg' ? 0.300 : 0.500) 
        ? 'bg-white border-2 border-red-300' 
        : 'bg-white border border-gray-300',
      [ZONE_TYPES.EDGE]: 'bg-yellow-50 border border-yellow-200',
      [ZONE_TYPES.CHASE]: 'bg-blue-50 border border-blue-200'
    }[zoneType];

    return `${baseStyle} ${currentStrategy.r2k_boost > 1.2 && zoneType !== ZONE_TYPES.HEART ? 'ring-2 ring-blue-400' : ''}`;
  };

  const renderZone = (location, label, type, width = 'w-24', height = 'h-20') => {
    const stats = batter.zones[location];
    const isExpandedZone = type !== ZONE_TYPES.HEART && currentStrategy.r2k_boost > 1.0;
    
    return (
      <button
        onClick={() => onSelectZone(location)}
        className={`
          ${width} ${height} p-1 rounded relative transition
          hover:bg-opacity-80 flex flex-col justify-center items-center
          ${getZoneStyle(stats, type)}
        `}
      >
        <div className="text-xs font-bold">{label}</div>
        <div className="text-xs">
          {showStat === 'avg' && `AVG: ${stats.avg}`}
          {showStat === 'slug' && `SLG: ${stats.slug}`}
          {showStat === 'whiff' && `Whiff: ${stats.whiff}`}
          {showStat === 'chase' && `Chase: ${stats.chase}`}
        </div>
        {isExpandedZone && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
            R2K+
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Stat Toggle Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          { key: 'avg', label: 'AVG' },
          { key: 'slug', label: 'SLG' },
          { key: 'whiff', label: 'Whiff%' },
          { key: 'chase', label: 'Chase%' }
        ].map(stat => (
          <button
            key={stat.key}
            onClick={() => setShowStat(stat.key)}
            className={`px-3 py-1 rounded text-sm ${
              showStat === stat.key 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {stat.label}
          </button>
        ))}
      </div>

      {/* Strategy Display */}
      <div className="mb-4 p-2 bg-blue-50 rounded w-full text-center">
        <p className="font-bold text-sm">R2K Strategy: {currentStrategy.expansion}</p>
        <p className="text-xs text-gray-600">{currentStrategy.priority}</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Chase High */}
        <div className="mb-1">
          {renderZone('chase_up', 'Chase High', ZONE_TYPES.CHASE, 'w-[calc(100%-32px)]', 'h-8 sm:h-12')}
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

        {/* Chase Low */}
        <div className="mt-1">
          {renderZone('chase_down', 'Chase Low', ZONE_TYPES.CHASE, 'w-[calc(100%-32px)]', 'h-8 sm:h-12')}
        </div>
      </div>

      {/* Advanced Stats Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>Strike Zone</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span>Borderline</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Chase</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-red-300 rounded"></div>
          <span>Hot Zone</span>
        </div>
        {currentStrategy.r2k_boost > 1.0 && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 ring-2 ring-blue-400 rounded"></div>
            <span>R2K Target</span>
          </div>
        )}
      </div>
    </div>
  );
};



const BatterAnalysis = ({ batter }) => {
  const [showTab, setShowTab] = useState('overview'); // overview, splits, situations, pitchTypes

  // Enhanced Overview Section
  const Overview = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="font-bold text-sm">Season Stats</h4>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <div>AVG: {batter.overall.avg}</div>
          <div>OBP: {batter.overall.obp}</div>
          <div>SLG: {batter.overall.slg}</div>
          <div>OPS: {batter.overall.ops}</div>
          <div>HR: {batter.overall.hr}</div>
          <div>RBI: {batter.overall.rbi}</div>
          {batter.overall.sb && <div>SB: {batter.overall.sb}</div>}
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-bold text-sm">Quick Notes</h4>
        <div className="text-sm space-y-1">
          {batter.notes.split('\n').map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      </div>
    </div>
  );

  // Splits Section
  const Splits = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-sm mb-2">Platoon Splits</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">vs RHP</div>
            <div className="grid grid-cols-2 text-sm">
              <div>AVG: {batter.splits.vs_right.avg}</div>
              <div>OBP: {batter.splits.vs_right.obp}</div>
              <div>SLG: {batter.splits.vs_right.slg}</div>
              <div>OPS: {batter.splits.vs_right.ops}</div>
            </div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">vs LHP</div>
            <div className="grid grid-cols-2 text-sm">
              <div>AVG: {batter.splits.vs_left.avg}</div>
              <div>OBP: {batter.splits.vs_left.obp}</div>
              <div>SLG: {batter.splits.vs_left.slg}</div>
              <div>OPS: {batter.splits.vs_left.ops}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Situational Stats
  const Situations = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-sm mb-2">Situational Hitting</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">RISP</div>
            <div className="text-sm">{batter.situational.risp.avg}/{batter.situational.risp.obp}/{batter.situational.risp.slg}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">RISP 2 Outs</div>
            <div className="text-sm">{batter.situational.risp_2out.avg}/{batter.situational.risp_2out.obp}/{batter.situational.risp_2out.slg}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">Late & Close</div>
            <div className="text-sm">{batter.situational.late_close.avg}/{batter.situational.late_close.obp}/{batter.situational.late_close.slg}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-bold">Ahead in Count</div>
            <div className="text-sm">{batter.situational.ahead_count.avg}/{batter.situational.ahead_count.obp}/{batter.situational.ahead_count.slg}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Pitch Type Performance
  const PitchTypes = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-sm mb-2">Pitch Type Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(batter.pitchTypes).map(([type, stats]) => (
            <div key={type} className="p-2 bg-gray-50 rounded">
              <div className="text-sm font-bold capitalize">{type}</div>
              <div className="grid grid-cols-2 text-sm">
                <div>AVG: {stats.avg}</div>
                <div>SLG: {stats.slug}</div>
                <div>Whiff: {stats.whiff}</div>
                <div>Chase: {stats.chase}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      {/* Header with key stats */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{batter.name}</h3>
          <p className="text-sm">Bats: {batter.bats} | Position: {batter.position}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{batter.overall.avg}/{batter.overall.obp}/{batter.overall.slg}</div>
          <div className="text-sm">OPS: {batter.overall.ops}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4 border-b">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'splits', label: 'Splits' },
          { id: 'situations', label: 'Situations' },
          { id: 'pitchTypes', label: 'Pitch Types' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setShowTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors
              ${showTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {showTab === 'overview' && <Overview />}
        {showTab === 'splits' && <Splits />}
        {showTab === 'situations' && <Situations />}
        {showTab === 'pitchTypes' && <PitchTypes />}
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

const BattingStats = ({ batter }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-bold mb-2">Current Split Stats</h3>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <div>vs RHP: {batter.splits.vs_right.avg}/{batter.splits.vs_right.obp}/{batter.splits.vs_right.slg}</div>
          <div>vs LHP: {batter.splits.vs_left.avg}/{batter.splits.vs_left.obp}/{batter.splits.vs_left.slg}</div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Situational</h3>
        <div className="text-sm">
          <div>RISP: {batter.situational.risp.avg}</div>
          <div>Late/Close: {batter.situational.late_close.avg}</div>
        </div>
      </div>
    </div>
  );
};

const PitchTypeAnalysis = ({ batter }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Pitch Type Analysis</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(batter.pitchTypes).map(([type, stats]) => (
          <div key={type} className="p-2 bg-gray-50 rounded">
            <div className="font-bold text-sm capitalize">{type}</div>
            <div className="text-xs">AVG: {stats.avg}</div>
            <div className="text-xs">Whiff: {stats.whiff}</div>
            <div className="text-xs">Chase: {stats.chase}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CountLeverageDisplay = ({ count, batter }) => {
  const leverage = (() => {
    const [balls, strikes] = count.split('-').map(Number);
    if (strikes > balls) return 'pitcher';
    if (balls > strikes) return 'hitter';
    return 'even';
  })();

  const stats = leverage === 'pitcher' ? batter.situational.behind_count :
                leverage === 'hitter' ? batter.situational.ahead_count :
                batter.overall;

  return (
    <div className={`mb-4 p-4 rounded-lg shadow ${
      leverage === 'pitcher' ? 'bg-green-50' :
      leverage === 'hitter' ? 'bg-red-50' :
      'bg-blue-50'
    }`}>
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Count Leverage</h3>
        <div className="text-sm">
          AVG: {stats.avg} | SLG: {stats.slg}
        </div>
      </div>
    </div>
  );
};



const PitcherTrainingTool = () => {
  const [gameState, setGameState] = useState({
    currentBatter: 0,
    count: { balls: 0, strikes: 0 },
    bases: [false, false, false],
    inning: 1,
    outs: 0,
    pitchHistory: [],
    r2kStats: {
      opportunities: 0,
      successful: 0,
      expanded_zones: 0
    }
  });

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
      SEADOGS_LINEUP[gameState.currentBatter],
      velocity,
      `${gameState.count.balls}-${gameState.count.strikes}`
    );

    const resultDescription = updateGameState(outcome, zone, pitch, velocity);
    setLastOutcome(resultDescription);
    setActivePitch(null);
  };

  const [selectedPitcher, setSelectedPitcher] = useState(null);
  const [activePitch, setActivePitch] = useState(null);
  const [lastOutcome, setLastOutcome] = useState(null);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  const ACTIVE_PITCHER = {
    name: "Current Pitcher",
    pitches: {
      FASTBALL: { name: "4-Seam Fastball", baseVelo: 93, range: 2, description: "Rising action" },
      SINKER: { name: "Sinker", baseVelo: 92, range: 2, description: "Heavy downward movement" },
      SLIDER: { name: "Slider", baseVelo: 83, range: 3, description: "Sharp late break" },
      CHANGEUP: { name: "Changeup", baseVelo: 84, range: 2, description: "Good fade" }
    }
  };
  
  // In the component initialization
  useEffect(() => {
    // Set default pitcher on component mount
    setSelectedPitcher(ACTIVE_PITCHER);
  }, []);

  const updateGameState = (outcome, zone, pitch, velocity) => {
    let newCount = { ...gameState.count };
    let newOuts = gameState.outs;
    let newCurrentBatter = gameState.currentBatter;
    let resultDescription = outcome.description;
    
    // Track R2K opportunities
    const isExpandedZone = zone.includes('chase') || zone.includes('borderline');
    const isSuccessfulR2K = isExpandedZone && 
      (outcome.type === 'SWING_MISS' || outcome.type === 'WEAK_CONTACT');

    // Update R2K stats
    let newR2kStats = {...gameState.r2kStats};
    if (isExpandedZone) {
      newR2kStats.opportunities++;
      if (isSuccessfulR2K) newR2kStats.successful++;
      newR2kStats.expanded_zones++;
    }

    // Handle pitch outcome
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
          newCurrentBatter = (newCurrentBatter + 1) % SEADOGS_LINEUP.length;
          newCount = { balls: 0, strikes: 0 };
        } else {
          newCurrentBatter = (newCurrentBatter + 1) % SEADOGS_LINEUP.length;
          newCount = { balls: 0, strikes: 0 };
        }
        break;
      default:
        console.warn(`Unhandled outcome type: ${outcome.type}`);
        break;
    };
    
    

    // Check for strikeout/walk
    if (newCount.strikes >= 3 || newCount.balls >= 4) {
      resultDescription = newCount.strikes >= 3 ? "Strikeout! ⚔️" : "Walk! 🚶";
      newCurrentBatter = (newCurrentBatter + 1) % SEADOGS_LINEUP.length;
      newCount = { balls: 0, strikes: 0 };
    }

    // Check for inning change
    if (newOuts >= 3) {
      return handleInningChange();
    }

    // Update state
    setGameState(prev => ({
      ...prev,
      count: newCount,
      outs: newOuts,
      currentBatter: newCurrentBatter,
      r2kStats: newR2kStats,
      pitchHistory: [...prev.pitchHistory, {
        type: activePitch,
        pitch: pitch.name,
        velocity,
        location: zone,
        outcome: resultDescription,
        count: `${prev.count.balls}-${prev.count.strikes}`,
        batter: SEADOGS_LINEUP[prev.currentBatter].name
      }]
    }));

    return resultDescription;
  };

  const handleInningChange = () => {
    setGameState(prev => ({
      ...prev,
      inning: prev.inning + 1,
      outs: 0,
      currentBatter: 0,
      count: { balls: 0, strikes: 0 },
      bases: [false, false, false]
    }));
    return "Inning over! Three outs! ⚾";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Sea Dogs Pitcher Training Tool</h1>
        <div className="flex flex-wrap gap-4">
          <div>Count: {gameState.count.balls}-{gameState.count.strikes}</div>
          <div>Outs: {gameState.outs}</div>
          <div>Inning: {gameState.inning}</div>
          <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {showAdvancedStats ? 'Hide' : 'Show'} Advanced Stats
          </button>
        </div>
      </div>

      {/* Current Batter Info */}
      <div className="mb-4 bg-blue-50 p-2 rounded">
        <h2 className="font-bold">Now Batting:</h2>
        <p className="text-lg">{SEADOGS_LINEUP[gameState.currentBatter].name}</p>
        <p className="text-sm">
          {SEADOGS_LINEUP[gameState.currentBatter].overall.avg}/
          {SEADOGS_LINEUP[gameState.currentBatter].overall.obp}/
          {SEADOGS_LINEUP[gameState.currentBatter].overall.slg}
        </p>
      </div>

      {showAdvancedStats && (
        <>
          <CountLeverageDisplay 
            count={`${gameState.count.balls}-${gameState.count.strikes}`}
            batter={SEADOGS_LINEUP[gameState.currentBatter]}
          />
          <BattingStats batter={SEADOGS_LINEUP[gameState.currentBatter]} />
          <PitchTypeAnalysis batter={SEADOGS_LINEUP[gameState.currentBatter]} />
        </>
      )}

      <BatterAnalysis batter={SEADOGS_LINEUP[gameState.currentBatter]} />

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
          batter={SEADOGS_LINEUP[gameState.currentBatter]}
          onSelect={handleZoneSelection}
          count={`${gameState.count.balls}-${gameState.count.strikes}`}
        />
      )}

      {gameState.pitchHistory.length > 0 && (
        <PitchHistory history={gameState.pitchHistory} />
      )}

      {/* R2K Performance Stats */}
      {gameState.r2kStats.opportunities > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">R2K Performance</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">Success Rate</p>
              <p>{((gameState.r2kStats.successful / gameState.r2kStats.opportunities) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-semibold">Expanded Zones</p>
              <p>{gameState.r2kStats.expanded_zones}</p>
            </div>
            <div>
              <p className="font-semibold">Opportunities</p>
              <p>{gameState.r2kStats.opportunities}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitcherTrainingTool;