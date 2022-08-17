import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Capitalize } from "../../globals/global_functions";
import { IAccountData, ITeam, ITournament } from "../../globals/types";

export interface Props {

}
const FindTournamentPage = (props: Props) => {
    const [public_tournaments, setPublic_tournaments] = useState<Array<ITournament>>([])

    const {
        displayName,
        biography,
        ign,
        statistics,
        team,
        favouriteChampion,
        rankInfo,
        tournaments,
        tournamentsMade,
        setUserDetails,
        settings
    } = useUser()

    useEffect(() => {
        getPublicTournaments()

    }, [])

    useEffect(() => {
        console.log(public_tournaments);
    }, [public_tournaments])



    const getPublicTournaments = async () => {
        // Retrieve all tournaments
        const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: '' })
        const result = await fetch(url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        let tournament_temp = result
        console.log(tournament_temp);

        let public_tournaments_temp: any = []

        const now = new Date()
        Object.keys(tournament_temp).forEach((key: any) => {
            let tournament_date = new Date(tournament_temp[key].date_time_start)

            // Guard Clauses
            if (tournament_temp[key].is_private) {
                return
            }
            if (now > tournament_date) {
                return
            }

            public_tournaments_temp.push(tournament_temp[key])
        });
        setPublic_tournaments(public_tournaments_temp)
        console.log(public_tournaments_temp);

    }


    // Fired on button click
    const joinTournament = async (id: string) => {

        // Account Redis
        let account_data: any = null
        const account_api_url =
            '/api/account?' + new URLSearchParams({ ign: ign })
        const account_get_response = await fetch(account_api_url)
            .then((res) => res.json())
            .then(async (res) => {
                if (res.status != 'Account does not exist') {
                    account_data = res
                }
            })
            .catch((res) => console.log(res.error))


        // Tournament Redis
        id = id.toUpperCase()
        console.log('joining tournament with tournament_id:', id)

        const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
        const result = await fetch(url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        let tournament_temp = result
        console.log('TUTEMP', id, tournament_temp);

        if (tournaments?.tournament_id == id) {
            alert('Your team is already part of a tournament.')
        } else {
            if (tournament_temp == null) {
                alert('Invalid Tournament Tag.')
            } else {
                if (tournament_temp.teams.length >= tournament_temp.type) {
                    alert('Tournament is full, please join another')
                } else {
                    if (tournament_temp.organized_by_ign == ign) {
                        alert(
                            'you are the Tournament owner, how did you even access this page? 🤔'
                        )
                    } else {
                        if (team?.team_owner != ign) {
                            alert('Only the team leader can sign up to tournaments')
                        } else {
                            //! tournament_temp.teams.push(team)

                            try {
                                const dataOut: IAccountData = {
                                    ign: ign,
                                    username: account_data.username,
                                    bio: account_data.bio,
                                    favourite_champion: account_data.favourite_champion,
                                    passcode: account_data.passcode,
                                    team_tag: account_data.team_tag,
                                    tournament_id: id,
                                    settings: account_data.settings,
                                    statistics: account_data.statistics


                                }
                                // console.log('data_out', dataOut)

                                const account_post_response = await fetch('/api/account', {
                                    body: JSON.stringify({ data: dataOut }),
                                    headers: { 'Content-Type': 'application/json' },
                                    method: 'PATCH',
                                })
                            } catch (error) {
                                console.log(error)
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
                                    tournament_temp,
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
                                    tournaments: tournament_temp,
                                    team: team,
                                })
                            )
                            // Redis team tournament set
                            let get_team_data: any = null
                            if (team != null) {
                                const team_api_url =
                                    '/api/teamData?' + new URLSearchParams({ team_tag: team.team_tag })
                                const team_get_response = await fetch(team_api_url)
                                    .then((res) => {
                                        if (!res.ok) {
                                            throw new Error('HTTP status ' + res.status)
                                        }
                                        return res.json()
                                    })
                                    .then(async (res) => {
                                        if (res.status != 'Team does not exist') {
                                            get_team_data = res.response
                                        }
                                    })
                                    .catch((res) => console.log(res.error))

                                if (get_team_data != undefined) {
                                    console.log(get_team_data);

                                    const teamDataOut: ITeam = {
                                        team_icon_path: get_team_data.team_icon_path,
                                        team_tag: get_team_data.team_tag,
                                        team_colour_hex: get_team_data.team_colour_hex,
                                        team_owner: get_team_data.team_owner,
                                        team_members: get_team_data.team_members,
                                        team_name: get_team_data.team_name,
                                        team_statistics: get_team_data.team_statistics,
                                        team_join_key: get_team_data.team_join_key,
                                        tournament_id: id
                                    }
                                    const team_post_response = await fetch('/api/teamData', {
                                        body: JSON.stringify({ data: teamDataOut }),
                                        headers: { 'Content-Type': 'application/json' },
                                        method: 'PATCH',
                                    }).then(() => {
                                        setTournamentRedis(tournament_temp, teamDataOut)
                                    })
                                }
                            }

                        }

                        Router.push('/main')
                    }
                }
            }
        }
    }

    const setTournamentRedis = async (tournament_temp: ITournament, teamDataOut: ITeam) => {
        // Redis tournament team set
        if (tournament_temp != undefined) {
            console.log(tournament_temp);
            let temp_teams: ITeam[] = tournament_temp.teams
            console.log('temp_teams:', temp_teams);

            temp_teams.push(teamDataOut)

            const tournamentDataOut: ITournament = {
                tournament_id: tournament_temp.tournament_id,
                tournament_name: tournament_temp.tournament_name,
                is_private: tournament_temp.is_private,
                organized_by_ign: tournament_temp.organized_by_ign,
                type: tournament_temp.type,
                rounds: tournament_temp.rounds,
                date_time_start: tournament_temp.date_time_start,
                date_time_end: tournament_temp.date_time_end,
                winning_team: tournament_temp.winning_team,
                lobby_code: tournament_temp.lobby_code,
                teams: temp_teams
            }
            const tournament_post_response = await fetch('/api/tournament/tournament', {
                body: JSON.stringify({ data: tournamentDataOut }),
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
            })
        }
    }


    return (
        <div
            id="wrapper"
            className=" grid h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
        >
            <Head>
                <title>Find Tournament</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="mx-auto w-full sm:w-full">
                <div className="flex flex-row gap-5 flex-wrap">

                    {public_tournaments.map((e) => {
                        return (
                            <div key={e.tournament_id} className="card w-96 bg-base-100 dark:bg-black-500 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">{Capitalize(e.tournament_name)}</h2>
                                    <div className="flex flex-row justify-between"><p>Organizer: {e.organized_by_ign}</p>
                                        <p className={`${e.teams.length / e.type < 0.5 ? 'text-lime-500' : ''} ${e.teams.length / e.type > 0.5 ? 'text-orange-500' : ''} flex justify-end`}>{e.teams.length} / {e.type} Teams</p></div>

                                    <p className="text-secondary">{new Date(e.date_time_start).toLocaleString()}</p>

                                    <div className="card-actions justify-start">
                                        <button onClick={() => joinTournament(e.tournament_id)} className="btn btn-primary btn-sm">Join Now</button>
                                    </div>
                                    <div className="absolute top-2 right-4 text-gray-500">{e.tournament_id}</div>
                                </div>
                            </div>


                        )
                    })}
                </div>
            </main >
        </div >
    );
}

export default FindTournamentPage;