"use client";

import React, {useState, useEffect } from "react";
import api from "...@/app/api";

interface AnimeInterface {
    title: string;
    episodes: number;
    main_character: string;
}

export const GetInfoFromBackend = () => {



    const [Anime, setAnime] = useState<AnimeInterface[]>([])
    const [animeTitle, setAnimeTitle] = useState("")
    const [animeEpisodes, setAnimeEpisodes] = useState(0)
    const [animeMainCharacter, setAnimeMainCharacter] = useState("")


    const handleAnimeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const animeObject: AnimeInterface = {
            title: animeTitle,
            episodes: animeEpisodes,
            main_character: animeMainCharacter
        }

        try{
            const response = await api.post('/anime-titles', animeObject);
            setAnime((prevAnime => [...prevAnime, response.data]))
            setAnimeTitle("")
            setAnimeEpisodes(0)
            setAnimeMainCharacter("")


            console.log(response.data)


        }
        catch(err){

            console.log(err)
        }

        console.log(Anime)


    }


    // Optional: load items from backend

    useEffect(() => {
        const fetchAnime = async() => {
            try {
                const response = await api.get("/anime-titles");
                const animeList = response.data
                setAnime(animeList)

                console.log(animeList)
            }
            catch(err){
                console.log(err)

            }

        }
        fetchAnime()
    }, [])


    return (
        <div className="flex flex-col p-4">
            <h2 className="text-xl font-bold mb-4">Get Information for anime</h2>

            <form onSubmit={handleAnimeSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-1">
                        Anime Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={animeTitle}
                        onChange={(e) => setAnimeTitle(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <label htmlFor="episodes" className="block mb-1">
                        Anime Episodes
                    </label>

                    <input
                        id="episodes"
                    type="number"
                    name="episodes"
                    value={animeEpisodes}
                    onChange={(e) => {
                        setAnimeEpisodes(parseInt(e.target.value, 10));
                    }}
                    className="border p-2 w-full rounded"
                    />

                    <label htmlFor="mainCharacter" className="block mb-1">
                        Main Character
                    </label>


                    <input
                        id="mainCharacter"
                        type="text"
                        name="mainCharacter"
                        value={animeMainCharacter}
                        onChange={(e) => setAnimeMainCharacter(e.target.value)}
                        className="border p-2 w-full rounded"

                    />



                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
                </div>
            </form>


            <div className="mt-4">
                <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
                    <div>Title</div>
                    <div>Episodes</div>
                    <div>Main Character</div>
                </div>


                <ul>

                    {Anime.map((anime, i) => (
                        <div className="grid grid-cols-3 grid-flow-row" key={i}>
                            <li>{anime.title}</li>
                            <li>{anime.episodes}</li>
                            <li>{anime.main_character}</li>
                        </div>


                    ))}
                </ul>


            </div>
        </div>
    );
};
