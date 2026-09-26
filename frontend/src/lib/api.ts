//Centralização de chamadas de API

import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

//Interceptor para injetar o token JWT guardado nos cookies
api.interceptors.request.use((config) => {
    const token = Cookies.get('vessel_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})