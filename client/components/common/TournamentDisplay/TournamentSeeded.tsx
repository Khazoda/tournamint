import { useEffect, useState } from "react"
import { Button } from "react-daisyui"
import { useUser } from "../../../context/UserContext"
import { ITeam, ITournament } from "../../../globals/types"

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
                        constructFirstRound(res.teams, res.type)
                    })
                    .catch((res) => console.log(res.error))

            }
        }
    }

    const constructFirstRound = (teams: ITeam[], type: number) => {
        const shuffledTeams = shuffleArray([...teams])

        const shuffled_half_1 = shuffledTeams
        const shuffled_half_2 = shuffledTeams.splice(0, teams.length >> 1);

        console.log(shuffled_half_1);
        console.log(shuffled_half_2);


        for (let i = 0; i < (type / 2) - 1; i++) {
            const team_1 = shuffled_half_1[i]
            const team_2 = shuffled_half_2[i]

            constructMatch(team_1, team_2, i)

        }
    }
    const constructMatch = (team_1: ITeam, team_2: ITeam, index: number) => {


    }

    return (
        <>
            {tournaments?.organized_by_ign == ign &&
                <div><Button onClick={() => seedTournament()}>Seed Tournament</Button></div>
            }
            {tournaments?.organized_by_ign != ign &&
                <>Waiting on tournament owner to seed...</>
            }
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