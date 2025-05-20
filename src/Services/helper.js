import axios from 'axios'

export const BASE_URL = 'https://localhost:8080/a'

export const myAxios = axios.create({
    baseURL : BASE_URL
});

