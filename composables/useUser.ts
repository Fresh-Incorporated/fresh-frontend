import { ref } from 'vue';
import { http, loginDiscord } from '~/composables/useHttp';
import type {Shop} from '~/types/freshmarket';

const user = ref(null);
const shops = ref<Shop[]>([]);
const cart = ref([]);
const orders = ref({orders: [], products: []});
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

    async function updateOrders() {
        const response = await http.get('/users/@me/orders');
        orders.value = response.data;
    }

    async function tryLoadUser() {
        userLoading.value = true;
        try {
            await updateUser()
            await updateOrders()
        } catch (error) { console.error(error); }
        userLoading.value = false;
    }

    async function logout() {
        await http.post(`/users/@me/logout`).then(() => {
            window.location.href = '/'
        })
    }

    function putInCart(product, count) {
        const inCartProduct = cart.value.find(_product => _product.id === product.id);
        if (inCartProduct) {
            if (inCartProduct.count < inCartProduct.picked + count) {
                inCartProduct.picked = inCartProduct.count;
            } else inCartProduct.picked += count;
        } else {
            cart.value.push({...product, picked: count});
        }

        cart.value = cart.value.filter(_product => _product.picked > 0);
    }

    return {
        user,
        userLoading,
        tryLoadUser,
        updateUser,
        logout,
        shops,
        updateShops,
        cart,
        putInCart,
        orders,
        updateOrders,
    };
};
