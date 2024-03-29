export interface IStatistics {
  log_ins: number
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
  team_icon_path: number
  team_tag: string
  team_colour_hex: string
  team_owner: string
  team_members: string[]
  team_name: string
  team_statistics: IStatistics
  team_join_key: string
  tournament_id: string
}

export interface ITeamColour {
  red: TEAM_COLOURS.RED
  orange: TEAM_COLOURS.ORANGE
  yellow: TEAM_COLOURS.YELLOW
  lime: TEAM_COLOURS.LIME
  green: TEAM_COLOURS.GREEN
  blue: TEAM_COLOURS.BLUE
}
export enum TEAM_COLOURS {
  RED = '#FF9AA2',
  ORANGE = '#FFB7B2',
  YELLOW = '#FFDAC1',
  LIME = '#E2F0CB',
  GREEN = '#B5EAD7',
  BLUE = '#C7CEEA',
}

// One Tournament has multiple Rounds
export interface ITournament {
  tournament_id: string
  tournament_name: string
  is_private: boolean
  organized_by_ign: string
  type: 4 | 8 | 16
  rounds: IRound[] | null
  date_time_start: string
  date_time_end: string | null
  winning_team: ITeam | null
  lobby_code: string
  teams: ITeam[]
}

// One Round has multiple Matches
export interface IRound {
  round_id: string
  matches: Array<IMatch>
  date_time_start: string
  date_time_end: string
  round_winners: Array<string>
}

// One Match has two Teams
export interface IMatch {
  match_id: string
  teams: Array<ITeam>
  date_time_start: string
  date_time_end: string
  match_winner: ITeam | null
}

// Account Data interface for client <-> redis server
export interface IAccountData {
  ign: string
  username: string
  bio: string
  favourite_champion: string
  passcode: string
  team_tag: string
  tournament_id: string
  settings: ISettings
  statistics: IStatistics
}

// Settings for visual and accessibility

export interface ISettings {
  centered_navbar: boolean
}
