import Head from "next/head";
import { useEffect, useState } from "react";

function join_public_tournament() {
    const [public_tournaments, setPublic_tournaments] = useState()

    useEffect(() => {
        getPublicTournaments()

    }, [])


    const getPublicTournaments = async () => {
        // Retrieve all tournaments
        const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: '' })
        const result = await fetch(url)
            .then((res) => res.json())
            .catch((res) => console.log(res.error))

        let tournament_temp = result
        console.log(tournament_temp);

        let public_tournaments_temp: any = {}
        Object.keys(tournament_temp).forEach((key: any) => {
            if (!tournament_temp[key].is_private) {
                public_tournaments_temp[key] = tournament_temp[key]
            }
        });
        setPublic_tournaments(public_tournaments_temp)
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
                boink
            </main>
        </div>
    );
}

export default join_public_tournament;