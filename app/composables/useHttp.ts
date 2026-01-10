import axios, { AxiosError } from 'axios';
import type { AxiosResponse, AxiosInstance } from 'axios';
import {toast} from "vue-sonner";

// Создаем экземпляр axios
export const http: AxiosInstance = axios.create({
    baseURL: import.meta.dev ? "http://localhost:3000/" : "https://api.fresh.zaralx.ru",
    withCredentials: true,
    timeout: 30000,
});

// Настройка interceptor для обработки ошибок
http.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.message) {
            toast.success("Успех", {
                description: response.data.message,
                duration: response.data.message.length * 100 + 2000,
            });
        }
        return response;
    },
    async (error: AxiosError<{ message: string }>) => {
        if (!error.response) return Promise.reject(error);
        const originalRequest = error.config;


        if (error.response.request.responseURL.includes("refresh")) {
            // skip
        } else if (error.response.status === 401) {
            try {
                await http.post('/users/@me/refresh');
                return http(originalRequest!);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        } else if (error.response.data.message) {
            toast.error('Произошла ошибка', {
                description: error.response.data?.message,
                duration: error.response.data?.message.length * 100 + 2000,
            })
        } else {
            toast.error('Произошла ошибка', {
                description: "Неизвестная ошибка",
                duration: 5000,
            })
        }

        return Promise.reject(error);
    }
);

export async function loginDiscord(code: string){
    try {
        const response = await http.post('auth/discord/login', { code });
        return { ok: true, ...response.data };
    } catch (e: any) {
        return { ok: false, error: e };
    }
}