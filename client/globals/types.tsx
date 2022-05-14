export interface IStatistics {
  tournaments_played: number
  tournaments_won: number
  matches_won: number
  people_met: number
}

export interface IRankInfo {
  wins: number
  losses: number
  tier: string
  rank: string
}

export interface IUser {
  displayName: string
  biography: string
  ign: string
  favouriteChampion: string
  tournamentsMade: number
  rankInfo: IRankInfo
  statistics: IStatistics
  tournaments: ITournament
  team: ITeam
}

export interface ITeam {
  team_tag: string
  team_owner: string
  team_members: Array<string>
  team_name: string
  team_statistics: IStatistics
}

// One Tournament has multiple Rounds
export interface ITournament {
  tournament_id: string
  organized_by: IUser
  type: 4 | 8 | 16
  rounds: Array<IRound>
  date_time_start: string
  date_time_end: string
  winning_team: ITeam
}

// One Round has multiple Matches
export interface IRound {
  match_id: string
  matches: Array<IMatch>
  date_time_start: string
  date_time_end: string
  round_winners: Array<ITeam>
}

// One Match has two Teams
export interface IMatch {
  match_id: string
  teams: Array<ITeam>
  date_time_start: string
  date_time_end: string
  match_winner: ITeam
}