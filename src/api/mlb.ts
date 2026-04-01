import type { SanitizedGame, Team } from './types'

const API_BASE = 'https://statsapi.mlb.com/api/v1'

function sanitizeGame(game: any): SanitizedGame {
  return {
    gamePk: game.gamePk,
    gameDate: game.gameDate,
    officialDate: game.officialDate,
    status: {
      abstractGameState: game.status.abstractGameState,
      detailedState: game.status.detailedState,
      statusCode: game.status.statusCode,
      startTimeTBD: game.status.startTimeTBD ?? false,
    },
    teams: {
      away: {
        id: game.teams.away.team.id,
        name: game.teams.away.team.name,
      },
      home: {
        id: game.teams.home.team.id,
        name: game.teams.home.team.name,
      },
    },
    inning: game.linescore
      ? {
          current: game.linescore.currentInning,
          ordinal: game.linescore.currentInningOrdinal,
          state: game.linescore.inningState,
          isTopInning: game.linescore.isTopInning,
          scheduled: game.linescore.scheduledInnings,
        }
      : null,
    venue: game.venue?.name ?? null,
    gameNumber: game.gameNumber ?? 1,
  }
}

export async function fetchDailySchedule(date: string): Promise<SanitizedGame[]> {
  const url = `${API_BASE}/schedule?sportId=1&date=${date}&hydrate=linescore`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`)
  const data = await res.json()

  const games: SanitizedGame[] = []
  for (const dateEntry of data.dates ?? []) {
    for (const game of dateEntry.games ?? []) {
      games.push(sanitizeGame(game))
    }
  }
  return games
}

export async function fetchTeamSchedule(
  teamId: number,
  startDate: string,
  endDate: string,
): Promise<SanitizedGame[]> {
  const url = `${API_BASE}/schedule?sportId=1&teamId=${teamId}&startDate=${startDate}&endDate=${endDate}&hydrate=linescore`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`)
  const data = await res.json()

  const games: SanitizedGame[] = []
  for (const dateEntry of data.dates ?? []) {
    for (const game of dateEntry.games ?? []) {
      games.push(sanitizeGame(game))
    }
  }
  return games
}

export async function fetchTeams(): Promise<Team[]> {
  const url = `${API_BASE}/teams?sportId=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`)
  const data = await res.json()

  return (data.teams ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    abbreviation: t.abbreviation,
    teamName: t.teamName,
    locationName: t.locationName,
  }))
}

export function teamLogoUrl(teamId: number): string {
  return `https://www.mlbstatic.com/team-logos/${teamId}.svg`
}
