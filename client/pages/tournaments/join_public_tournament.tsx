import Head from "next/head";
import { useEffect, useState } from "react";
import { Capitalize } from "../../globals/global_functions";
import { ITournament } from "../../globals/types";

export interface Props {

}
const FindTournamentPage = (props: Props) => {
    const [public_tournaments, setPublic_tournaments] = useState<Array<ITournament>>([])

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
        Object.keys(tournament_temp).forEach((key: any) => {
            // Guard Clauses
            if (tournament_temp[key].is_private) {
                return
            }
            if (new Date() > tournament_temp[key].startDateTime) {
                return
            }

            public_tournaments_temp.push(tournament_temp[key])
        });
        setPublic_tournaments(public_tournaments_temp)
        console.log(public_tournaments_temp);

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
                            <div className="card w-96 bg-base-100 dark:bg-black-500 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">{Capitalize(e.tournament_name)}</h2>
                                    <div className="flex flex-row justify-between"><p>Organizer: {e.organized_by_ign}</p>
                                        <p>Number of Teams:{e.type}</p></div>

                                    <p className="text-secondary">{e.date_time_start}</p>

                                    <div className="card-actions justify-start">
                                        <button className="btn btn-primary btn-sm">Join Now</button>
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