

export const useXIS = () => {
    function getFullFace(identify: string) {
        return "https://img.zaralx.ru/v1/minecraft/user/face/full/" + identify;
    }

    return {
        getFullFace,
    }
}