export default defineNuxtRouteMiddleware(async () => {
    const existsToken = useCookie('access_token');
    const store = useUserStore();
    const {isAuthenticated} = storeToRefs(store)

    if (existsToken.value && !isAuthenticated.value) {
        await store.load().catch(() => {
            useCookie('access_token').value = null;
        });
    }
})