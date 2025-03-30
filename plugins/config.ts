export default defineNuxtPlugin(() => {
    return {
        provide: {
            freshConfig: {
                discordAuth: "https://discord.com/oauth2/authorize?client_id=1053625870272704613&response_type=code&redirect_uri=http%3A%2F%2Ffresh.zaralx.ru%2Fauth%2Fdiscord%2Fend&scope=identify"
            }
        }
    };
});
