import VueApexCharts from 'vue3-apexcharts';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('apexchart', VueApexCharts); // имя компонента должно быть 'apexchart' (с маленькой буквы)
});