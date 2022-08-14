import { useEffect, useState } from 'react'
import MatchTidbit from '../MatchTidbit'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { IMatch, IRound, ITeam, ITournament } from '../../../globals/types'
import logos from '../../../globals/team_logos'
import { Button } from 'react-daisyui'
import { useUser } from '../../../context/UserContext'
import TeamTidbit from '../TeamTidbit'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}

interface ITournamentBracket {
  type: 4 | 8 | 16
}
const defaults: ITournamentBracket = {
  type: 16,
}
const TournamentDisplay = (props: {
  team?: ITeam | null
  tournament: ITournament | null

}) => {
  // Default prop values
  const { team = null, tournament = null, ...restProps } = props
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false)
  const [showAdminPanelHelp, setShowAdminPanelHelp] = useState<boolean>(false)
  const [currentMatchData, setCurrentMatchData] = useState<Array<any>>([])

  const {
    displayName,
    biography,
    ign,
    statistics,
    favouriteChampion,
    rankInfo,
    tournaments,
    tournamentsMade,
    setUserDetails,
  } = useUser()

  const getTag = (round: number, match: number, team: 0 | 1): string => {
    let tag = '- - - '
    if (tournament && tournament.rounds) {
      try {
        const temp = tournament.rounds[round].matches[match].teams[team].team_tag
        if (temp != 'ABC123' || temp != undefined || temp != null) {
          tag = temp
        }
      } catch (error) {
        tag = '- - -'
      }
    }
    return tag
  }
  const getIconIndex = (round: number, match: number, team: 0 | 1): number => {
    let icon_index = 0
    if (tournament && tournament.rounds) {
      try {
        const temp = tournament.rounds[round].matches[match].teams[team].team_icon_path
        if (temp != undefined || temp != null) {
          icon_index = temp
        }
      } catch (error) {
        icon_index = 10
      }
    }
    return icon_index
  }

  useEffect(() => {
    calculateCurrentMatches()
    console.log('tournament changed, :', tournament);

  }, [tournament])

  const calculateCurrentMatches = () => {
    let currentMatches: Array<any> = []
    if (!tournament) { return }
    if (!tournament.rounds) { return }
    tournament.rounds.forEach((round: IRound) => {
      round.matches.forEach((match: IMatch) => {
        if (match == null) { return }
        if (match.match_winner == null) {
          currentMatches.push({ round, match })
        }
      })
    })
    setCurrentMatchData(currentMatches)
  }

  const setLocalStorageUserContext = (tournament_temp: ITournament, round: IRound, match: IMatch, winner: ITeam) => {
    // LS, UC tournament rounds set
    if (!tournament_temp) { return }
    if (!tournament_temp.rounds) { return }

    console.log(tournament_temp);
    let temp_rounds: IRound[] = tournament_temp.rounds
    let temp_tournament: ITournament = tournament_temp

    temp_rounds[parseInt(round.round_id)].matches[parseInt(match.match_id)].match_winner = winner
    temp_tournament.rounds = temp_rounds

    if (setUserDetails != undefined) {
      setUserDetails(
        displayName,
        biography,
        ign,
        favouriteChampion,
        rankInfo,
        statistics,
        tournamentsMade,
        temp_tournament,
        team
      )
    }
    localStorage.setItem(
      'userDetails',
      JSON.stringify({
        displayName: displayName,
        biography: biography,
        ign: ign,
        favouriteChampion: favouriteChampion,
        rankInfo: {
          tier: rankInfo.tier,
          rank: rankInfo.rank,
          wins: rankInfo.wins,
          losses: rankInfo.losses,
        },
        statistics: {
          tournaments_played: statistics.tournaments_played,
          tournaments_won: statistics.tournaments_won,
          matches_won: statistics.matches_won,
          people_met: statistics.people_met,
        },
        tournamentsMade: tournamentsMade,
        tournaments: temp_tournament,
        team: team,
      })
    )
  }
  const setTournamentRedisMatchWon = async (tournament_temp: ITournament, round: IRound, match: IMatch, winner: ITeam) => {
    // Redis tournament rounds set
    if (!tournament_temp) { return }
    if (!tournament_temp.rounds) { return }

    console.log(tournament_temp);
    let temp_rounds: IRound[] = tournament_temp.rounds
    console.log('temp_teams:', temp_rounds);

    temp_rounds[parseInt(round.round_id)].matches[parseInt(match.match_id)].match_winner = winner
    temp_rounds[parseInt(round.round_id)].round_winners.push(winner.team_tag)
    // temp_rounds[parseInt(round.round_id)].round_winners = []

    const tournamentDataOut: ITournament = {
      tournament_id: tournament_temp.tournament_id,
      tournament_name: tournament_temp.tournament_name,
      is_private: tournament_temp.is_private,
      organized_by_ign: tournament_temp.organized_by_ign,
      type: tournament_temp.type,
      rounds: temp_rounds,
      date_time_start: tournament_temp.date_time_start,
      date_time_end: tournament_temp.date_time_end,
      winning_team: tournament_temp.winning_team,
      lobby_code: tournament_temp.lobby_code,
      teams: tournament_temp.teams
    }
    const tournament_post_response = await fetch('/api/tournament/tournament', {
      body: JSON.stringify({ data: tournamentDataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    calculateCurrentMatches()

  }
  const setTournamentRedisNewMatch = async (tournament_temp: ITournament | null, round: number, match: IMatch,) => {
    // Redis tournament rounds set
    if (!tournament_temp) { return }
    if (!tournament_temp.rounds) { return }

    let temp_rounds: IRound[] = tournament_temp.rounds
    if (temp_rounds[round] == null) {
      temp_rounds[round] = {
        round_id: round.toString(),
        date_time_start: '',
        date_time_end: '',
        matches: [],
        round_winners: []
      }
      temp_rounds[round].matches[parseInt(match.match_id)] = match
    } else {
      temp_rounds[round].matches[parseInt(match.match_id)] = match
    }
    const tournamentDataOut: ITournament = {
      tournament_id: tournament_temp.tournament_id,
      tournament_name: tournament_temp.tournament_name,
      is_private: tournament_temp.is_private,
      organized_by_ign: tournament_temp.organized_by_ign,
      type: tournament_temp.type,
      rounds: temp_rounds,
      date_time_start: tournament_temp.date_time_start,
      date_time_end: tournament_temp.date_time_end,
      winning_team: tournament_temp.winning_team,
      lobby_code: tournament_temp.lobby_code,
      teams: tournament_temp.teams
    }
    if (setUserDetails != undefined) {
      setUserDetails(
        displayName,
        biography,
        ign,
        favouriteChampion,
        rankInfo,
        statistics,
        tournamentsMade,
        tournamentDataOut,
        team
      )
    }
    localStorage.setItem(
      'userDetails',
      JSON.stringify({
        displayName: displayName,
        biography: biography,
        ign: ign,
        favouriteChampion: favouriteChampion,
        rankInfo: {
          tier: rankInfo.tier,
          rank: rankInfo.rank,
          wins: rankInfo.wins,
          losses: rankInfo.losses,
        },
        statistics: {
          tournaments_played: statistics.tournaments_played,
          tournaments_won: statistics.tournaments_won,
          matches_won: statistics.matches_won,
          people_met: statistics.people_met,
        },
        tournamentsMade: tournamentsMade,
        tournaments: tournamentDataOut,
        team: team,
      })
    )


    const tournament_post_response = await fetch('/api/tournament/tournament', {
      body: JSON.stringify({ data: tournamentDataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    calculateCurrentMatches()

  }
  const handleMatchWinner = (round: IRound, match: IMatch, winner: ITeam) => {
    if (!tournament) { return }
    setTournamentRedisMatchWon(tournament, round, match, winner)
    setLocalStorageUserContext(tournament, round, match, winner)

    const round_id = parseInt(round.round_id)
    const match_id = parseInt(match.match_id)
    switch (tournament.type) {
      case 4:
        if ((match_id) <= 1) { }
        break;
      case 8:
        if ((match_id) <= 1) { }
        if (2 <= (match_id) && (match_id) <= 3) { }
        break;
      case 16:
        if (round_id == 0) {
          if ((match_id) <= 1) {
            if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
          }
          if (2 <= (match_id) && (match_id) <= 3) {
            if (bracketIsFinished(1, round)) { createMatch(round, 1, round_id + 1, winner, round.matches[match_id]) }
          }
          if (4 <= (match_id) && (match_id) <= 5) {
            if (bracketIsFinished(2, round)) { createMatch(round, 2, round_id + 1, winner, round.matches[match_id]) }
          }
          if (6 <= (match_id) && (match_id) <= 7) {
            if (bracketIsFinished(3, round)) { createMatch(round, 3, round_id + 1, winner, round.matches[match_id]) }
          }
        }
        if (round_id == 1) {
          if ((match_id) <= 1) {
            if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
          }
          if (2 <= (match_id) && (match_id) <= 3) {
            if (bracketIsFinished(1, round)) { createMatch(round, 1, round_id + 1, winner, round.matches[match_id]) }
          }
        }
        if (round_id == 2) {
          if ((match_id) == 0) {
            if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
          }
          if (match_id == 1) {
            if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
          }
        }
        if (round_id == 3) {
          if ((match_id) == 0) {
            alert('TODO: CODE THE WINNER DATA SETTING FOR TEAM' + winner.team_name)
          }
        }
        break;
      default:
        break;
    }

  }
  const bracketIsFinished = (bracket_number: number, round: IRound): boolean => {
    // bracketCounter is used to determine whether a bracket has finished (2 matches)
    let bracketCounter = 0
    if (round.matches[2 * bracket_number].match_winner != null) { bracketCounter += 1 }
    if (round.matches[2 * bracket_number + 1].match_winner != null) { bracketCounter += 1 }
    if (bracketCounter == 2) { return true } else { return false }
  }

  const createMatch = (previousRound: IRound, previousBracketNumber: number, round_num: number, winner_1: ITeam, match: IMatch) => {
    var winner_2: ITeam | null = null
    if (parseInt(match.match_id) % 2 == 0) { winner_2 = previousRound.matches[parseInt(match.match_id) + 1].match_winner }
    if (parseInt(match.match_id) % 2 != 0) { winner_2 = previousRound.matches[parseInt(match.match_id) - 1].match_winner }
    if (winner_2 == null) { return }

    const newMatch: IMatch = {
      match_id: previousBracketNumber.toString(),
      teams: [winner_1, winner_2],
      date_time_start: '',
      date_time_end: '',
      match_winner: null
    }

    setTournamentRedisNewMatch(tournament, round_num, newMatch)

  }


  const getMatchWinner = (team_1_tag: string, team_2_tag: string, round: number): ITeam | null => {
    if (!tournament) { return null }
    if (!tournament.rounds) { return null }
    if (!tournament.rounds[round]) { return null }
    var winner: ITeam | null = null

    if (tournament.rounds[round].round_winners.includes(team_1_tag)) {
      tournament.teams.forEach((team) => {
        if (team.team_tag == team_1_tag) {
          winner = team
        }
      })
    }
    if (tournament.rounds[round].round_winners.includes(team_2_tag)) {
      tournament.teams.forEach((team) => {
        if (team.team_tag == team_2_tag) {
          winner = team
        }
      })
    }


    return winner
  }

  const DEBUGRESETWINNERS = async () => {
    const tournament_temp = tournament
    // Redis tournament rounds set
    if (!tournament_temp) { return }
    if (!tournament_temp.rounds) { return }

    let temp_rounds: IRound[] = tournament_temp.rounds
    temp_rounds[0].matches.forEach((match) => {
      match.match_winner = null
    })
    temp_rounds = [{
      round_id: '0',
      date_time_start: temp_rounds[0].date_time_start,
      date_time_end: temp_rounds[0].date_time_end,
      matches: temp_rounds[0].matches,
      round_winners: []
    }
    ]

    const tournamentDataOut: ITournament = {
      tournament_id: tournament_temp.tournament_id,
      tournament_name: tournament_temp.tournament_name,
      is_private: tournament_temp.is_private,
      organized_by_ign: tournament_temp.organized_by_ign,
      type: tournament_temp.type,
      rounds: temp_rounds,
      date_time_start: tournament_temp.date_time_start,
      date_time_end: tournament_temp.date_time_end,
      winning_team: tournament_temp.winning_team,
      lobby_code: tournament_temp.lobby_code,
      teams: tournament_temp.teams
    }
    const tournament_post_response = await fetch('/api/tournament/tournament', {
      body: JSON.stringify({ data: tournamentDataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    console.log(tournament_post_response);

    calculateCurrentMatches()
  }
  // alert('Team ' + match.teams[0].team_tag + ' won match ' + match.match_id + ' vs ' + match.teams[1].team_tag + ' in round ' + round.round_id)
  const adminButton = <label htmlFor="panel-modal" className="btn modal-button btn-primary mx-auto mt-2">open admin panel</label>
  const adminPanel = (<div>
    <input type="checkbox" id="panel-modal" className="modal-toggle" />
    <div className="modal">
      {!showAdminPanelHelp ?
        <div className="modal-box relative w-full dark:bg-black-600">
          <label htmlFor="panel-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <label className="btn btn-sm btn-circle text-primary absolute right-12 top-2" onClick={() => setShowAdminPanelHelp(!showAdminPanelHelp)}>?</label>
          <h3 className="text-lg font-bold">Tournament Control Panel</h3>
          <h4 className=' mt-2'>Click on a team to select the match winner</h4>
          <div className='flex flex-col flex-wrap'>
            {currentMatchData.map(({ round, match }: any) => {
              return (
                <div key={'winner-selector-' + match.match_id} className='my-1 flex flex-row h-11 w-full gap-2 items-center'>
                  Round <span className='text-lg text-center align-middle'>{round.round_id}</span>
                  <div className='flex h-full w-full flex-row hover:outline-2 hover:outline outline-primary hover:cursor-pointer' onClick={() => handleMatchWinner(round, match, match.teams[0])}>
                    <TeamTidbit
                      winner={null}
                      side="left"
                      team_tag={match.teams[0].team_tag}
                      team_icon_path={match.teams[0].team_icon_path == 10 ? '' : logos[match.teams[0].team_icon_path].src}
                    ></TeamTidbit>
                  </div>
                  <div className="relative h-full w-0.5 bg-transparent z-50">
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
                      VS
                    </span>
                  </div>
                  <div className='flex h-full w-full flex-row hover:outline-2 hover:outline outline-primary hover:cursor-pointer' onClick={() => handleMatchWinner(round, match, match.teams[1])}>
                    <TeamTidbit
                      winner={null}
                      side="left"
                      team_tag={match.teams[1].team_tag}
                      team_icon_path={match.teams[1].team_icon_path == 10 ? '' : logos[match.teams[1].team_icon_path].src}
                    ></TeamTidbit>
                  </div>
                </div>
              )
            })}

          </div>

        </div>
        :
        <div className="modal-box relative w-full dark:bg-black-600">
          <label htmlFor="panel-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <label className="btn btn-sm btn-circle text-secondary absolute right-12 top-2" onClick={() => setShowAdminPanelHelp(!showAdminPanelHelp)}>?</label>
          <label className="btn btn-sm btn-circle text-secondary absolute right-24 top-2" onClick={() => DEBUGRESETWINNERS()}>😍</label>

          <h3 className="text-lg font-bold">Instructions</h3>
          <p className="py-4">After a match has finished, please log the winning team in this panel. This will update the tournament information for everyone.</p>

          <p className="py-4">TODO: When match is marked as finished, algorithm waits for the other match in the bracket to finish [0,1][2,3], then populates next round with winners from previous round.</p>
          <p className="py-4">In the meantime, the match that just finished should grey out the match loser</p>

          <p className="py-4">Repeat this process for each round, implementing a kind of asynchronous round system based on when matches finish, culminating in a final</p>
        </div>
      }
    </div>
  </div>
  )


  var output = <></>
  if (tournament && tournament.rounds) {
    if (tournament.type == 4) {
      output = (
        <div>
          {tournament.organized_by_ign == ign && adminButton}
          {adminPanel}

          <div className="grid grid-cols-3 p-5">
            <div className="mr-4 flex flex-col justify-between">
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 0, 0), getTag(0, 0, 1), 0)}

                    team_1_tag={getTag(0, 0, 0)}
                    team_1_icon_index={getIconIndex(0, 0, 0)}

                    team_2_tag={getTag(0, 0, 1)}
                    team_2_icon_index={getIconIndex(0, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 1, 0), getTag(0, 1, 1), 0)}
                    team_1_tag={getTag(0, 1, 0)}
                    team_1_icon_index={getIconIndex(0, 1, 0)}

                    team_2_tag={getTag(0, 1, 1)}
                    team_2_icon_index={getIconIndex(0, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <span className="bg-white-200"></span>
            </div>
            <div className="mx-4 flex flex-col justify-center">
              <div className="relative before:absolute before:-left-2 before:top-1/2 before:h-0 before:w-2 before:border-b-[2px] before:border-black-600  dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 0, 0), getTag(1, 0, 1), 1)}
                    team_1_tag={getTag(1, 0, 0)}
                    team_1_icon_index={getIconIndex(1, 0, 0)}

                    team_2_tag={getTag(1, 0, 1)}
                    team_2_icon_index={getIconIndex(1, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (tournament.type == 8) {
      output = (
        <div>
          {tournament.organized_by_ign == ign && adminButton}
          {adminPanel}

          <div className=" mt-auto grid grid-cols-[_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr)] gap-5 overflow-x-scroll overscroll-x-contain scroll-smooth p-2 scrollbar-none">
            {/* Left 1 */}
            <div
              id="left_side"
              className="mr-4 flex flex-col justify-between pl-2"
            >
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 0, 0), getTag(0, 0, 1), 0)}
                    team_1_tag={getTag(0, 0, 0)}
                    team_1_icon_index={getIconIndex(0, 0, 0)}

                    team_2_tag={getTag(0, 0, 1)}
                    team_2_icon_index={getIconIndex(0, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 1, 0), getTag(0, 1, 1), 0)}
                    team_1_tag={getTag(0, 1, 0)}
                    team_1_icon_index={getIconIndex(0, 1, 0)}

                    team_2_tag={getTag(0, 1, 1)}
                    team_2_icon_index={getIconIndex(0, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 2, 0), getTag(0, 2, 1), 0)}
                    team_1_tag={getTag(0, 2, 0)}
                    team_1_icon_index={getIconIndex(0, 2, 0)}

                    team_2_tag={getTag(0, 2, 1)}
                    team_2_icon_index={getIconIndex(0, 2, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 3, 0), getTag(0, 3, 1), 0)}
                    team_1_tag={getTag(0, 3, 0)}
                    team_1_icon_index={getIconIndex(0, 3, 0)}

                    team_2_tag={getTag(0, 3, 1)}
                    team_2_icon_index={getIconIndex(0, 3, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Left 2 */}
            <div className="mr-4 flex flex-col justify-around">
              <div className="relative mb-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-b-[2px] before:border-black-600 after:absolute after:-right-6 after:top-1/2 after:h-[150%] after:w-6 after:rounded-tr-[9.6px]  after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 0, 0), getTag(1, 0, 1), 1)}
                    team_1_tag={getTag(1, 0, 0)}
                    team_1_icon_index={getIconIndex(1, 0, 0)}

                    team_2_tag={getTag(1, 0, 1)}
                    team_2_icon_index={getIconIndex(1, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-b-[2px] before:border-black-600 after:absolute after:-right-6 after:bottom-1/2 after:h-[150%] after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 1, 0), getTag(1, 1, 1), 1)}
                    team_1_tag={getTag(1, 1, 0)}
                    team_1_icon_index={getIconIndex(1, 1, 0)}

                    team_2_tag={getTag(1, 1, 1)}
                    team_2_icon_index={getIconIndex(1, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Center */}
            <div className="mx-4 flex flex-col justify-around  ">
              <div className="relative before:absolute before:-left-7 before:top-1/2 before:h-0 before:w-7 before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(2, 0, 0), getTag(2, 0, 1), 2)}
                    team_1_tag={getTag(2, 0, 0)}
                    team_1_icon_index={getIconIndex(2, 0, 0)}

                    team_2_tag={getTag(2, 0, 1)}
                    team_2_icon_index={getIconIndex(2, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (tournament.type == 16) {
      output = (
        <div className="flex h-full flex-col justify-center">
          {tournament.organized_by_ign == ign && adminButton}
          {adminPanel}
          <div className=" mt-auto grid grid-cols-[_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr)] gap-5 overflow-x-scroll overscroll-x-contain scroll-smooth p-5 scrollbar-none">
            {/* Left 1 */}
            <div
              id="left_side"
              className="mr-4 flex flex-col justify-between pl-2"
            >
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 0, 0), getTag(0, 0, 1), 0)}
                    team_1_tag={getTag(0, 0, 0)}
                    team_1_icon_index={getIconIndex(0, 0, 0)}

                    team_2_tag={getTag(0, 0, 1)}
                    team_2_icon_index={getIconIndex(0, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 1, 0), getTag(0, 1, 1), 0)}
                    team_1_tag={getTag(0, 1, 0)}
                    team_1_icon_index={getIconIndex(0, 1, 0)}

                    team_2_tag={getTag(0, 1, 1)}
                    team_2_icon_index={getIconIndex(0, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 2, 0), getTag(0, 2, 1), 0)}
                    team_1_tag={getTag(0, 2, 0)}
                    team_1_icon_index={getIconIndex(0, 2, 0)}

                    team_2_tag={getTag(0, 2, 1)}
                    team_2_icon_index={getIconIndex(0, 2, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 3, 0), getTag(0, 3, 1), 0)}
                    team_1_tag={getTag(0, 3, 0)}
                    team_1_icon_index={getIconIndex(0, 3, 0)}

                    team_2_tag={getTag(0, 3, 1)}
                    team_2_icon_index={getIconIndex(0, 3, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Left 2 */}
            <div className="mr-4 flex flex-col justify-around">
              <div className="relative mb-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-t-[2px]  before:border-black-600 dark:before:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 0, 0), getTag(1, 0, 1), 1)}
                    team_1_tag={getTag(1, 0, 0)}
                    team_1_icon_index={getIconIndex(1, 0, 0)}

                    team_2_tag={getTag(1, 0, 1)}
                    team_2_icon_index={getIconIndex(1, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-t-[2px]  before:border-black-600  dark:before:border-white-300 dark:after:border-white-300 after:absolute after:h-36 after:w-6 after:border-b-[2px] after:border-r-[2px]  after:-right-6 after:bottom-4 after:rounded-br-xl after:border-black-800">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 1, 0), getTag(1, 1, 1), 1)}
                    team_1_tag={getTag(1, 1, 0)}
                    team_1_icon_index={getIconIndex(1, 1, 0)}

                    team_2_tag={getTag(1, 1, 1)}
                    team_2_icon_index={getIconIndex(1, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Center */}
            <div className="mx-4 flex flex-col justify-around  ">
              <div className="relative before:absolute before:-left-[52px] before:top-1/2 before:h-0 before:w-[52px] before:border-b-[2px] before:border-black-600  dark:before:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(2, 0, 0), getTag(2, 0, 1), 2)}
                    team_1_tag={getTag(2, 0, 0)}
                    team_1_icon_index={getIconIndex(2, 0, 0)}

                    team_2_tag={getTag(2, 0, 1)}
                    team_2_icon_index={getIconIndex(2, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative  dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(3, 0, 0), getTag(3, 0, 1), 3)}
                    team_1_tag={getTag(3, 0, 0)}
                    team_1_icon_index={getIconIndex(3, 0, 0)}

                    team_2_tag={getTag(3, 0, 1)}
                    team_2_icon_index={getIconIndex(3, 0, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative  after:absolute after:-right-[52px] after:top-1/2 after:h-0 after:w-[52px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(2, 1, 0), getTag(2, 1, 1), 2)}
                    team_1_tag={getTag(2, 1, 0)}
                    team_1_icon_index={getIconIndex(2, 1, 0)}

                    team_2_tag={getTag(2, 1, 1)}
                    team_2_icon_index={getIconIndex(2, 1, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Right 2 */}
            <div className="ml-4 flex flex-col justify-around">
              <div className="relative mb-4 after:absolute after:-right-3 after:top-1/2 after:h-0 after:w-3 after:border-t-[2px]  after:border-black-600  dark:after:border-white-300 dark:before:border-white-300 before:absolute before:h-36 before:w-6 before:border-t-[2px] before:border-l-[2px]  before:-left-6 before:top-4 before:rounded-tl-xl before:border-black-800
 ">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 2, 0), getTag(1, 2, 1), 1)}
                    team_1_tag={getTag(1, 2, 0)}
                    team_1_icon_index={getIconIndex(1, 2, 0)}

                    team_2_tag={getTag(1, 2, 1)}
                    team_2_icon_index={getIconIndex(1, 2, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-3 after:top-1/2 after:h-0 after:w-3 after:border-t-[2px]  after:border-black-600  dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(1, 3, 0), getTag(1, 3, 1), 1)}
                    team_1_tag={getTag(1, 3, 0)}
                    team_1_icon_index={getIconIndex(1, 3, 0)}

                    team_2_tag={getTag(1, 3, 1)}
                    team_2_icon_index={getIconIndex(1, 3, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Right 1 */}
            <div
              id="right_side"
              className="ml-4 flex flex-col justify-between pr-2"
            >
              <div className="relative mb-2 before:absolute before:-left-6 before:top-1/2 before:h-full before:w-6 before:rounded-tl-[9.6px] before:border-l-[2px] before:border-t-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 4, 0), getTag(0, 4, 1), 0)}
                    team_1_tag={getTag(0, 4, 0)}
                    team_1_icon_index={getIconIndex(0, 4, 0)}

                    team_2_tag={getTag(0, 4, 1)}
                    team_2_icon_index={getIconIndex(0, 4, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 before:absolute before:-left-6 before:bottom-1/2 before:h-full before:w-6 before:rounded-bl-[9.6px] before:border-l-[2px] before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 5, 0), getTag(0, 5, 1), 0)}
                    team_1_tag={getTag(0, 5, 0)}
                    team_1_icon_index={getIconIndex(0, 5, 0)}

                    team_2_tag={getTag(0, 5, 1)}
                    team_2_icon_index={getIconIndex(0, 5, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-6 before:top-1/2 before:h-full before:w-6 before:rounded-tl-[9.6px] before:border-l-[2px] before:border-t-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 6, 0), getTag(0, 6, 1), 0)}
                    team_1_tag={getTag(0, 6, 0)}
                    team_1_icon_index={getIconIndex(0, 6, 0)}

                    team_2_tag={getTag(0, 6, 1)}
                    team_2_icon_index={getIconIndex(0, 6, 1)}
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 before:absolute before:-left-6 before:bottom-1/2 before:h-full before:w-6 before:rounded-bl-[9.6px] before:border-l-[2px] before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    winner={getMatchWinner(getTag(0, 7, 0), getTag(0, 7, 1), 0)}
                    team_1_tag={getTag(0, 7, 0)}
                    team_1_icon_index={getIconIndex(0, 7, 0)}

                    team_2_tag={getTag(0, 7, 1)}
                    team_2_icon_index={getIconIndex(0, 7, 1)}
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
          <div className="mt-auto mb-8 flex h-4 w-8 flex-row self-center">
            <a
              href="#left_side"
              className="h-9 transition-transform hover:-translate-x-1"
            >
              <FiChevronLeft size={36}></FiChevronLeft>
            </a>
            <a
              href="#right_side"
              className="h-9 transition-transform hover:translate-x-1"
            >
              <FiChevronRight size={36}></FiChevronRight>
            </a>
          </div>
        </div>
      )
    }
  }
  return output
}

export default TournamentDisplay
