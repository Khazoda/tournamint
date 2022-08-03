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
            if (!tournament_temp[key].is_private) {
                public_tournaments_temp.push(tournament_temp[key])
            }
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
            <main className="mx-auto w-full sm:w-[300px]">
                <div>

                    {public_tournaments.map((e) => {
                        return (
                            <>
                                <div>{Capitalize(e.tournament_name)}</div>
                                <div>{e.organized_by_ign}</div>
                                <div>{e.type}</div>
                                <div>{e.date_time_start}</div>

                                <div>{e.tournament_id}</div>
                            </>
                        )
                    })}
                </div>
            </main >
        </div >
    );
}

export default FindTournamentPage;