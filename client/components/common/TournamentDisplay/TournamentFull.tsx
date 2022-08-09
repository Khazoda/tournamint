import { ITeam, ITournament } from "../../../globals/types"
import logos from '../../../globals/team_logos'
import { useEffect, useState } from "react"
import { DD_PREFIX } from "../../../globals/riot_consts"
import Image from 'next/image'
import { useUser } from "../../../context/UserContext"
import moment from "moment"

const TournamentFull = (props: {
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
    const [human_time_until_seed, setHuman_time_until_seed] = useState()

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

    useEffect(() => {
        getBracketSeedingDateTime()

    }, [fresh_tournament_data])



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

    const getBracketSeedingDateTime = () => {
        // This function will give the time from the user's present until one hour before the start of the tournament, which is when the bracket will be seeded
        var result: any = moment(fresh_tournament_data?.date_time_start).subtract(1, 'hour');
        result = result.fromNow()
        setHuman_time_until_seed(result)
    }
    return (
        <>
            {/* <div>{fresh_tournament_data != undefined && fresh_tournament_data.teams.length} / {props.tournament.type} teams have joined</div> */}
            <div className="mt-4 text-lg text-yellow-600 dark:text-yellow-400">The tournament is full. Return to this page {human_time_until_seed} (1hr before tournament start)</div>
            <div className="w-full h-full flex flex-row flex-wrap gap-4 mt-8 justify-evenly">
                {fresh_tournament_data != undefined && fresh_tournament_data.teams.map((team: ITeam) => {

                    return (
                        <div className="relative">
                            <img src={logos[team.team_icon_path].src} alt="team_icon" className="rounded-xl w-16 h-16 absolute -top-10 left-1/2 -translate-x-1/2 z-50" />
                            <div key={team.team_tag} style={team.team_tag == userTeam.team_tag ? { borderColor: 'lime', borderWidth: '4px' } : { borderColor: team.team_colour_hex }} className={" border-2 card w-24 h-36 bg-slate-600 dark:bg-gray-700 shadow-xl"}>
                                <h1 title={team.team_name} style={{ color: team.team_colour_hex }} className="card-title text-3xl tracking-widest drop-shadow-lg mx-auto pt-2 cursor-default hover:scale-105 ">{team.team_tag}</h1>
                                <div className="card-body items-center text-center p-2">
                                    {/* <h1 className="card-title text-xl max-w-[10rem] text-ellipsis overflow-hidden inline" title={team.team_name}>{team.team_name}</h1> */}

                                    {riot_data[team.team_tag] != undefined ?
                                        <div
                                            title={team.team_owner}
                                            className="group hover:scale-105 relative inline h-[68px] w-[68px] border-2 border-green-500 transition-[border]  md:h-[60px] md:w-[60px] "
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
                                            <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] ">
                                                {riot_data[team.team_tag].summonerLevel === undefined
                                                    ? '666'
                                                    : riot_data[team.team_tag].summonerLevel}
                                            </span>
                                        </div>
                                        :
                                        <div
                                            title="View Profile"
                                            className="group relative inline h-[68px] w-[68px] border-2 border-green-500 transition-[border] md:h-[60px] md:w-[60px] "
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
                                            <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] ">
                                                666
                                            </span>
                                        </div>

                                    }

                                </div>
                            </div>
                        </div>
                    )
                })}


            </div>

        </>
    )
}


export default TournamentFull