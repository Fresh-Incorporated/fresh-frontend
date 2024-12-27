import { ref } from 'vue';

const user = ref(null); // Реактивное состояние пользователя
const userLoading = ref<boolean>(true); // Состояние загрузки

export const useUser = () => {
    function tryLoadUser() {
        userLoading.value = true;
        setTimeout(() => {
            user.value = { nickname: '_zaralX_' };
            userLoading.value = false;
        }, 1000);
    }

    return {
        user,
        userLoading,
        tryLoadUser,
    };
};
