import { ref } from 'vue';
import { http, loginDiscord } from '~/composables/useHttp';

const user = ref(null);
const shops = ref([]);
const userLoading = ref<boolean>(true);

export const useUser = () => {

    async function updateUser() {
        const response = await http.get('/users/@me');
        user.value = response.data;
    }

    async function updateShops() {
        const response = await http.get('/users/@me/shops');
        shops.value = response.data;
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
        shops,
        updateShops,
    };
};
