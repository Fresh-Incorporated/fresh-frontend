

export const useXIS = () => {
    function getFullFace(identify: string) {
        return "https://assets.zaralx.ru/api/v1/minecraft/vanilla/player/face/" + identify + "/full";
    }

    return {
        getFullFace,
    }
}