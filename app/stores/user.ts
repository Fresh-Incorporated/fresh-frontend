import {defineStore} from 'pinia'
import type {User} from '~/types/user'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | User,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        async logout() {
            this.user = null;
            useCookie('access_token').value = null;
            useCookie('refresh_token').value = null;

            await navigateTo('/');
        },
        async load(t?: string) {
            const token = t ?? useCookie('access_token').value
            if (!token) {
                return ;
            }
            const {$api} = useNuxtApp();

            const options: { method: 'GET'; headers?: Record<string, string> } = {method: 'GET'};

            if (token) {
                options.headers = {Authorization: `Bearer ${token}`};
            }

            return await $api<User | null>(`/users/@me/`, options).then((response) => {
                    this.user = response;
                    return Promise.resolve(response);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
    }
})
