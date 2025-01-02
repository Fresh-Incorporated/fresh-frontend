import { ref } from 'vue';
import { http, loginDiscord } from '~/composables/useHttp';

const user = ref(null); // Реактивное состояние пользователя
const userLoading = ref<boolean>(true); // Состояние загрузки

export const useUser = () => {

    async function updateUser() {
        const response = await http.post('/users/@me');
        user.value = response.data;
    }

    async function tryLoadUser() {
        userLoading.value = true;
        try {
            await updateUser()
        } catch (error) { console.error(error); }
        userLoading.value = false;
    }

    async function logout() {
        await http.post(`/users/@me/logout`).then(() => {
            window.location.href = '/'
        })
    }

    return {
        user,
        userLoading,
        tryLoadUser,
        updateUser,
        logout,
    };
};
