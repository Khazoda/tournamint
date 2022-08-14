import { useEffect, useState } from "react"
import Image from 'next/image'
import { Button } from "react-daisyui"
import { useUser } from "../../../context/UserContext"
import { IMatch, IRound, ITeam, ITournament } from "../../../globals/types"
import MatchTidbit from "../MatchTidbit"
import logos from '../../../globals/team_logos'
import { DD_PREFIX } from "../../../globals/riot_consts"

const TournamentSeeded = (props: {
    team: ITeam,
    tournament: ITournament
}) => {
    const {
        displayName,
        biography,
        ign,
        statistics,
        favouriteChampion,
        rankInfo,
        team,
        tournaments,
        tournamentsMade,
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

    return (
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

            {/* {tournaments?.rounds && <>{tournaments.rounds.map((m: any) => {
                return m.matches.map((m: any) => {
                    return (
                        <MatchTidbit
                            team_1_tag={m.teams[0].team_tag}
                            team_1_icon_index={
                                logos[m.teams[0].team_icon_path].src ||
                                'images/team_icons/logo_0.svg'
                            }
                            team_2_tag={m.teams[1].team_tag}
                            team_2_icon_index={
                                logos[m.teams[1].team_icon_path].src ||
                                'images/team_icons/logo_0.svg'
                            }
                        ></MatchTidbit>


                    )
                })
            })}</>} */}
        </>
    )
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