import {toast} from "vue-sonner";

export default defineNuxtPlugin({
    name: "backend-api",
    dependsOn: [],
    async setup() {
        const config = useRuntimeConfig();
        const baseURL = `${config.public.apiDomain}`;

        const api = $fetch.create({
            baseURL,
            onRequest({options}) {
                const token = useCookie('access_token')
                const headers = new Headers(options.headers as HeadersInit);
                if (token.value) {
                    headers.set("Authorization", `Bearer ${token.value}`);
                }
                options.headers = headers;
            },
            onResponse({response}) {
                if (response.ok && response._data?.message) {
                    toast.success("Успех", {
                        description: response._data.message,
                        duration: response._data.message.length * 100 + 2000,
                    })
                }
            },
            async onResponseError({response}) {
                const message = response._data?.message || "Неизвестная ошибка"

                toast.error('Произошла ошибка', {
                    description: message,
                    duration: message.length * 100 + 2000,
                })
            }
        })

        return {
            provide: {
                api
            }
        }
    }
})