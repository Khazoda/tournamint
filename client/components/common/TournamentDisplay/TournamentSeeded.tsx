import { useEffect, useState } from "react"
import Image from 'next/image'
import { Button } from "react-daisyui"
import { useUser } from "../../../context/UserContext"
import { IMatch, IRound, ITeam, ITournament } from "../../../globals/types"
import MatchTidbit from "../MatchTidbit"
import logos from '../../../globals/team_logos'
import { DD_PREFIX } from "../../../globals/riot_consts"
import { Capitalize } from "../../../globals/global_functions"
import TeamTidbit from "../TeamTidbit"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import moment from "moment"

const TournamentSeeded = (props: {
    team: ITeam,
    tournament: ITournament
}) => {
    const { team = null, tournament = null, ...restProps } = props
    const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false)
    const [showAdminPanelHelp, setShowAdminPanelHelp] = useState<boolean>(false)
    const [currentMatchData, setCurrentMatchData] = useState<Array<any>>([])
    const [human_time_until_seed, setHuman_time_until_seed] = useState()

    // Default prop values
    const {
        displayName,
        biography,
        ign,
        statistics,
        favouriteChampion,
        rankInfo,
        tournaments,
        tournamentsMade,
        settings,
        setUserDetails,
    } = useUser()

    let userTeam: ITeam
    if (team != null) {
        userTeam = team
    }

    const [fresh_tournament_data, setFresh_tournament_data] = useState<ITournament>()
    const [riot_data, setRiot_data] = useState<any>({})
    const changeObjectState = (team: ITeam, data: { profileIconId: any; summonerLevel: any }) => {
        setRiot_data((riot_data: any) => ({
            ...riot_data,
            [team.team_tag]: {
                profileIconId: data.profileIconId,
                summonerLevel: data.summonerLevel
            }
        }));
    };


    useEffect(() => {
        refreshTournamentData()

        props.tournament.teams.forEach(async (team) => {
            if (team.team_tag != '') {
                const data = await getLolData(team.team_owner)
                changeObjectState(team, data)
            }
        })



    }, [])





    const getLolData = async (ign: string) => {
        const account_api_url =
            '/api/userData?' + new URLSearchParams({ ign: ign })
        const account_get_response = await fetch(account_api_url)
            .then((res) => res.json())
            .then((res) => {
                return res
            })
            .catch((res) => console.log(res.error))
        return account_get_response

    }
    const seedTournament = () => {
        if (tournaments) {
            refreshTournamentData()
        }
    }
    const refreshTournamentData = async () => {
        if (tournaments != null) {
            let id = tournaments.tournament_id.toUpperCase()
            console.log('id:', id);

            if (id != 'ABC123') {
                // Tournament Redis
                const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
                const result = await fetch(url)
                    .then((res) => res.json()).then((res) => {
                        constructFirstRound(res.teams, res.type, res)
                    })
                    .catch((res) => console.log(res.error))

            }
        }
    }

    const constructFirstRound = (teams: ITeam[], type: number, tournament: ITournament) => {
        const shuffledTeams = shuffleArray([...teams])

        const shuffled_half_1 = shuffledTeams
        const shuffled_half_2 = shuffledTeams.splice(0, teams.length >> 1);

        let matches: Array<IMatch> = []

        for (let i = 0; i < (type / 2); i++) {

            const team_1 = shuffled_half_1[i]
            const team_2 = shuffled_half_2[i]
            matches.push(constructMatch(team_1, team_2, i, tournament))

        }

        updateRedis(matches, tournament)


    }
    const constructMatch = (team_1: ITeam, team_2: ITeam, index: number, tournament: ITournament): IMatch => {

        return ({ match_id: index.toString(), teams: [team_1, team_2], date_time_start: tournament.date_time_start, date_time_end: '', match_winner: null })
    }

    const updateRedis = async (matches: Array<IMatch>, tournament: ITournament) => {
        // Set Tournament Rounds Redis
        if (tournament) {
            const id = tournament.tournament_id.toUpperCase()
            console.log('creating matches for tournament with ID:', id)


            const firstRound: IRound = {
                round_id: '0',
                matches: matches,
                date_time_start: tournament.date_time_start,
                date_time_end: "",
                round_winners: []
            }

            // Redis tournament team set
            if (tournament != undefined) {
                console.log(tournament)

                const tournamentDataOut: ITournament = {
                    tournament_id: tournament.tournament_id,
                    tournament_name: tournament.tournament_name,
                    is_private: tournament.is_private,
                    organized_by_ign: tournament.organized_by_ign,
                    type: tournament.type,
                    rounds: [firstRound],
                    date_time_start: tournament.date_time_start,
                    date_time_end: tournament.date_time_end,
                    winning_team: tournament.winning_team,
                    lobby_code: tournament.lobby_code,
                    teams: tournament.teams
                }
                const tournament_post_response = await fetch('/api/tournament/tournament', {
                    body: JSON.stringify({ data: tournamentDataOut }),
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                })
            }
        }
    }




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
                team,
                settings
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
                    log_ins: statistics.log_ins,
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
                team,
                settings
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
                    log_ins: statistics.log_ins,
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

    // const patchUserStatistics = async (team_tag: string, data: {}) => {

    //   tournament?.teams.forEach((team) => {
    //     if (team.team_tag == team_tag) {
    //       team.team_members.forEach((member) => {
    //         var new_member_data: IAccountData | null = {}}
    //         getAccountData(member).then((res) => {
    //           new_member_data = {
    //             ign: res.ign,
    //             username: res.username,
    //             bio: res.bio,
    //             favourite_champion: res.favourite_champion,
    //             passcode: res.passcode,
    //             team_tag: res.team_tag,
    //             tournament_id: res.tournament_id,
    //             settings: res.settings,
    //             statistics: {
    //               matches_won: res.statistics.matches_won,
    //               people_met: res.statistics.people_met,
    //               log_ins: res.statistics.log_ins,
    //               tournaments_won: res.statistics.tournaments_won
    //             }
    //           }
    //         }).then((data: any) => {
    //           new_member_data.statistics[data[0]] = data[1]
    //         })


    //       })
    //     }
    //   })

    //   const account_post_response = await fetch('/api/account', {
    //     body: JSON.stringify({ data: dataOut }),
    //     headers: { 'Content-Type': 'application/json' },
    //     method: 'POST',
    //   })
    // }
    const getAccountData = async (ign: string) => {
        // Get Team data from cloud
        const account_api_url =
            '/api/account?' + new URLSearchParams({ ign: Capitalize(ign) })
        const result = await fetch(account_api_url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        let team_temp = result.response
        return team_temp
    }
    const patchTeamStatistics = async (team: ITeam | null) => {
        if (!team) { return }
        incrementPeopleMet(team.team_tag)

    }
    const incrementPeopleMet = async (tag: string) => {
        const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
        const temp_team = await fetch(url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        var team_temp = temp_team.response
        console.log('TEAMIES', temp_team);

        team_temp.team_statistics.people_met += 5

        const response = await fetch('/api/teamData', {
            body: JSON.stringify({ data: team_temp }),
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
        })

        if (setUserDetails != undefined) {
            if (tag == team?.team_tag) {
                setUserDetails(
                    displayName,
                    biography,
                    ign,
                    favouriteChampion,
                    rankInfo,
                    statistics,
                    tournamentsMade,
                    tournaments,
                    team_temp,
                    settings
                )

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
                            log_ins: statistics.log_ins,
                            tournaments_won: statistics.tournaments_won,
                            matches_won: statistics.matches_won,
                            people_met: statistics.people_met,
                        },
                        tournamentsMade: tournamentsMade,
                        tournaments: tournaments,
                        team: team_temp,
                    })
                )
            }
        }
    }
    const handleMatchWinner = (round: IRound, match: IMatch, winner: ITeam) => {
        if (!tournament) { return }
        setTournamentRedisMatchWon(tournament, round, match, winner)
        setLocalStorageUserContext(tournament, round, match, winner)

        const round_id = parseInt(round.round_id)
        const match_id = parseInt(match.match_id)


        // patchUserStatistics(winner.team_tag, { 'matches_won': 1 })
        patchTeamStatistics(winner)
        patchTeamStatistics(getLoser(round, winner, round.matches[match_id]))

        switch (tournament.type) {
            case 4:
                if (round_id == 0) {

                    if ((match_id) <= 1) {
                        if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
                    }
                }
                if (round_id == 1) {
                    if ((match_id) == 0) {
                        alert('TODO: CODE THE WINNER DATA SETTING FOR TEAM' + winner.team_name)
                    }
                }
                break;
            case 8:
                if (round_id == 0) {
                    if ((match_id) <= 1) {
                        if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
                    }
                    if (2 <= (match_id) && (match_id) <= 3) {
                        if (bracketIsFinished(1, round)) { createMatch(round, 1, round_id + 1, winner, round.matches[match_id]) }
                    }
                }
                if (round_id == 1) {
                    if ((match_id) <= 1) {
                        if (bracketIsFinished(0, round)) { createMatch(round, 0, round_id + 1, winner, round.matches[match_id]) }
                    }
                }
                if (round_id == 2) {
                    if ((match_id) == 0) {
                        alert('TODO: CODE THE WINNER DATA SETTING FOR TEAM' + winner.team_name)

                    }
                }
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

    const getLoser = (round: IRound, winner: ITeam, match: IMatch): ITeam | null => {
        var loser: ITeam | null = null

        if (round.matches[parseInt(match.match_id)].teams[0].team_tag == winner.team_tag) { loser = round.matches[parseInt(match.match_id)].teams[1] }
        if (round.matches[parseInt(match.match_id)].teams[1].team_tag == winner.team_tag) { loser = round.matches[parseInt(match.match_id)].teams[0] }

        return loser
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

    var output = <></>
    if (tournament && !tournament.rounds) {
        output = (
            <>
                {(tournaments?.organized_by_ign == ign && !tournaments?.rounds) &&
                    <div><Button onClick={() => seedTournament()}>Seed Tournament</Button></div>
                }
                {(tournaments?.organized_by_ign != ign && !tournaments?.rounds) &&
                    <>
                        <>Waiting on tournament owner to seed. Try refreshing</>
                        <div><Button onClick={() => alert('TODO: implement refresh tournament round data')}>Refresh</Button></div>

                    </>
                }


            </>
        )
    }
    useEffect(() => {
        getBracketSeedingDateTime()

    }, [tournament])

    const getBracketSeedingDateTime = () => {
        // This function will give the time from the user's present until one hour before the start of the tournament, which is when the bracket will be seeded
        var result: any = moment(tournament?.date_time_start);
        result = result.fromNow()
        setHuman_time_until_seed(result)
    }


    if (tournament && tournament.rounds) {
        if (tournament.type == 4) {
            output = (
                <div>
                    {tournament.organized_by_ign == ign}
                    <div className="my-4 text-lg text-yellow-600 dark:text-yellow-400">The tournament is seeded. Please see the initial brackets below. The tournament will start {human_time_until_seed}</div>
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
                            <div className="relative px-2 scale-110 ">
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


function shuffleArray(array: any[]) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

export default TournamentSeeded