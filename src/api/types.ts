export interface SanitizedGame {
  gamePk: number
  gameDate: string
  officialDate: string
  status: {
    abstractGameState: 'Preview' | 'Live' | 'Final'
    detailedState: string
    statusCode: string
    startTimeTBD: boolean
  }
  teams: {
    away: { id: number; name: string }
    home: { id: number; name: string }
  }
  inning: {
    current: number
    ordinal: string
    state: string
    isTopInning: boolean
    scheduled: number
  } | null
  venue: string | null
  gameNumber: number
}

export interface Team {
  id: number
  name: string
  abbreviation: string
  teamName: string
  locationName: string
}
