import { ITeam, ITournament } from "../../../globals/types"
import logos from '../../../globals/team_logos'
import { useEffect, useState } from "react"
import { DD_PREFIX } from "../../../globals/riot_consts"
import Image from 'next/image'
import { useUser } from "../../../context/UserContext"

const TournamentFillingUp = (props: {
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

    const [fresh_tournament_data, setFresh_tournament_data] = useState<ITournament>()
    const [riot_data, setRiot_data] = useState<any>({})
    let empty_spots_counter: number[] = [1, 1, 1, 1, 1]

    const changeObjectState = (team: ITeam, data: { profileIconId: any; summonerLevel: any }) => {
        setRiot_data((riot_data: any) => ({
            ...riot_data,
            [team.team_tag]: {
                profileIconId: data.profileIconId,
                summonerLevel: data.summonerLevel
            }
        }));
    };

    const refreshTournamentData = async () => {
        // Tournament Redis
        let id = props.tournament.tournament_id.toUpperCase()
        const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
        const result = await fetch(url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        setFresh_tournament_data(result)
    }


    useEffect(() => {
        refreshTournamentData()
        for (let index = 0; index < (props.tournament.type - props.tournament.teams.length); index++) {
            empty_spots_counter.push(1)
        }

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
    return (
        <>
            {/* <div>{fresh_tournament_data != undefined && fresh_tournament_data.teams.length} / {props.tournament.type} teams have joined</div> */}
            <div className="mt-4 text-lg">The tournament is not full yet. Please wait for more teams to join.</div>
            <div className="w-full h-full flex flex-row flex-wrap gap-4 mt-4">
                {fresh_tournament_data != undefined && fresh_tournament_data.teams.map((team: ITeam) => {

                    return (
                        <div key={team.team_tag} style={{ borderColor: team.team_colour_hex }} className={" border-2 card w-48 h-64 bg-base-100 dark:bg-gray-700 shadow-xl"}>
                            <div className=" w-full h-24 flex flex-row items-center justify-center bg-black-400 drop-shadow-lg">
                                <img src={logos[team.team_icon_path].src} alt="team_icon" className="rounded-xl w-20 h-20" />
                                <h1 style={{ color: team.team_colour_hex }} className="card-title text-3xl tracking-widest drop-shadow-lg">{team.team_tag}</h1>
                            </div>
                            <div className="card-body items-center text-center p-2">
                                <h1 className="card-title text-xl max-w-[10rem] text-ellipsis overflow-hidden inline" title={team.team_name}>{team.team_name}</h1>

                                {riot_data[team.team_tag] != undefined ?
                                    <div
                                        title="View Profile"
                                        className="group relative inline h-[68px] w-[68px] border-2 border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                                    >
                                        <Image
                                            src={
                                                riot_data[team.team_tag].profileIconId === undefined
                                                    ? '/images/spinner.svg'
                                                    : DD_PREFIX +
                                                    'img/profileicon/' +
                                                    riot_data[team.team_tag].profileIconId +
                                                    '.png'
                                            }
                                            alt="Profile picture"
                                            layout="fill"
                                            objectFit="cover"
                                            className=""
                                        ></Image>
                                        <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                                            {riot_data[team.team_tag].summonerLevel === undefined
                                                ? '666'
                                                : riot_data[team.team_tag].summonerLevel}
                                        </span>
                                    </div>
                                    :
                                    <div
                                        title="View Profile"
                                        className="group relative inline h-[68px] w-[68px] border-2 border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                                    >
                                        <Image
                                            src={
                                                '/images/spinner.svg'

                                            }
                                            alt="Profile picture"
                                            layout="fill"
                                            objectFit="cover"
                                            className=""
                                        ></Image>
                                        <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                                            666
                                        </span>
                                    </div>

                                }
                                <div className="block pt-2">{team.team_owner}</div>

                            </div>
                        </div>
                    )
                })}
                {
                    fresh_tournament_data != undefined &&
                    [...Array(props.tournament.type - fresh_tournament_data.teams.length)].map((e, i) =>
                        <div key={i} style={{ borderColor: 'gray' }} className={" border-2 card w-48 h-64 bg-base-100 dark:bg-gray-900 shadow-xl"}>
                        </div>
                    )
                }

            </div>

        </>
    )
}


export default TournamentFillingUp