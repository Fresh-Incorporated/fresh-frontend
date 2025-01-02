export default defineNuxtPlugin(() => {
    return {
        provide: {
            freshConfig: {
                discordAuth: "https://discord.com/oauth2/authorize?client_id=988380114112872469&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fdiscord%2Fend&scope=identify"
            }
        }
    };
});
