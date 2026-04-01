import type { SanitizedGame } from "./types";

function formatDate(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

const today = formatDate(new Date());
const tomorrow = offsetDate(1);
const in2Days = offsetDate(2);
const in3Days = offsetDate(3);

// Twins games for favorites testing (no game today)
const twinsGameTomorrow: SanitizedGame = {
  gamePk: 900001,
  gameDate: `${tomorrow}T23:10:00Z`,
  officialDate: tomorrow,
  status: {
    abstractGameState: "Preview",
    detailedState: "Scheduled",
    statusCode: "S",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 142, name: "Minnesota Twins" },
    home: { id: 145, name: "Chicago White Sox" },
  },
  inning: null,
  venue: "Guaranteed Rate Field",
  gameNumber: 1,
};

const twinsGameIn2Days: SanitizedGame = {
  gamePk: 900002,
  gameDate: `${in2Days}T23:10:00Z`,
  officialDate: in2Days,
  status: {
    abstractGameState: "Preview",
    detailedState: "Scheduled",
    statusCode: "S",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 142, name: "Minnesota Twins" },
    home: { id: 114, name: "Cleveland Guardians" },
  },
  inning: null,
  venue: "Progressive Field",
  gameNumber: 1,
};

const twinsGameIn3Days: SanitizedGame = {
  gamePk: 900003,
  gameDate: `${in3Days}T20:10:00Z`,
  officialDate: in3Days,
  status: {
    abstractGameState: "Preview",
    detailedState: "Scheduled",
    statusCode: "S",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 114, name: "Cleveland Guardians" },
    home: { id: 142, name: "Minnesota Twins" },
  },
  inning: null,
  venue: "Target Field",
  gameNumber: 1,
};

// In progress games for 9th/extra inning testing
const game9thInning: SanitizedGame = {
  gamePk: 900010,
  gameDate: `${today}T23:05:00Z`,
  officialDate: today,
  status: {
    abstractGameState: "Live",
    detailedState: "In Progress",
    statusCode: "I",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 147, name: "New York Yankees" },
    home: { id: 111, name: "Boston Red Sox" },
  },
  inning: {
    current: 9,
    ordinal: "9th",
    state: "Top",
    isTopInning: true,
    scheduled: 9,
  },
  venue: "Fenway Park",
  gameNumber: 1,
};

const game11thInning: SanitizedGame = {
  gamePk: 900011,
  gameDate: `${today}T22:40:00Z`,
  officialDate: today,
  status: {
    abstractGameState: "Live",
    detailedState: "In Progress",
    statusCode: "I",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 119, name: "Los Angeles Dodgers" },
    home: { id: 137, name: "San Francisco Giants" },
  },
  inning: {
    current: 11,
    ordinal: "11th",
    state: "Bottom",
    isTopInning: false,
    scheduled: 9,
  },
  venue: "Oracle Park",
  gameNumber: 1,
};

// Some extra games for the bank
const upcomingGame: SanitizedGame = {
  gamePk: 900020,
  gameDate: `${today}T23:35:00Z`,
  officialDate: today,
  status: {
    abstractGameState: "Preview",
    detailedState: "Scheduled",
    statusCode: "S",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 108, name: "Los Angeles Angels" },
    home: { id: 136, name: "Seattle Mariners" },
  },
  inning: null,
  venue: "T-Mobile Park",
  gameNumber: 1,
};

const completedGame: SanitizedGame = {
  gamePk: 900021,
  gameDate: `${today}T17:05:00Z`,
  officialDate: today,
  status: {
    abstractGameState: "Final",
    detailedState: "Final",
    statusCode: "F",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 143, name: "Philadelphia Phillies" },
    home: { id: 121, name: "New York Mets" },
  },
  inning: {
    current: 9,
    ordinal: "9th",
    state: "End",
    isTopInning: false,
    scheduled: 9,
  },
  venue: "Citi Field",
  gameNumber: 1,
};

const inProgressGame: SanitizedGame = {
  gamePk: 900022,
  gameDate: `${today}T20:10:00Z`,
  officialDate: today,
  status: {
    abstractGameState: "Live",
    detailedState: "In Progress",
    statusCode: "I",
    startTimeTBD: false,
  },
  teams: {
    away: { id: 112, name: "Chicago Cubs" },
    home: { id: 138, name: "St. Louis Cardinals" },
  },
  inning: {
    current: 5,
    ordinal: "5th",
    state: "Top",
    isTopInning: true,
    scheduled: 9,
  },
  venue: "Busch Stadium",
  gameNumber: 1,
};

export const mockDailyGames: SanitizedGame[] = [
  game9thInning,
  game11thInning,
  inProgressGame,
  upcomingGame,
  completedGame,
];

// All mock games across dates for team schedule lookups
const allMockGames: SanitizedGame[] = [
  ...mockDailyGames,
  twinsGameTomorrow,
  twinsGameIn2Days,
  twinsGameIn3Days,
];

export function mockTeamSchedule(
  teamId: number,
  startDate: string,
  endDate: string,
): SanitizedGame[] {
  return allMockGames.filter((g) => {
    const hasTeam = g.teams.away.id === teamId || g.teams.home.id === teamId;
    const inRange = g.officialDate >= startDate && g.officialDate <= endDate;
    return hasTeam && inRange;
  });
}
