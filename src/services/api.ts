import axios from "axios"

export const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: {
        api_key: "274a50fc6ffbae0fa2fe08a17e3bf2c8",
        language: "pt-BR",
        include_adult: false,
    },
})