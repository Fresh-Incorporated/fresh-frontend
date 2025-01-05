import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Создаем экземпляр axios
export const http: AxiosInstance = axios.create({
    baseURL:  "http://localhost:3000/",
    withCredentials: true,
    timeout: 30000,
});

// Настройка interceptor для обработки ошибок
http.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.message) ElMessage.success(response.data.message);
        return response;
    },
    async (error: AxiosError) => {
        if (!error.response) return Promise.reject(error);
        const originalRequest = error.config;

        if (error.response.status === 401) {
            try {
                await http.post('/users/@me/refresh');
                return http(originalRequest!);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        } else {
            ElMessage.error(error.response.data.message || 'Произошла ошибка');
        }

        return Promise.reject(error);
    }
);

export async function loginDiscord(code: string){
    console.log(code);
    try {
        const response = await http.post('auth/discord/login', { code });
        return { ok: true, ...response.data };
    } catch (e: any) {
        return { ok: false, error: e };
    }
}