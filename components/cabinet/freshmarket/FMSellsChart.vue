<script setup lang="ts">
const props = defineProps({
  sells: Array,
});

const options = {
  chart: {
    id: 'char',
    toolbar: {
      show: false
    },
    sparkline: {
      enabled: true
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: 'easeout',
      speed: 1000,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.25,
      opacityTo: 0,
      stops: [50, 95]
    }
  },

  grid: {
    show: false,
    padding: { bottom: 10 },
  },

  xaxis: {
    categories: [1, 2, 3, 4, 5, 6, 7],
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  tooltip: {
    theme: 'none',
    custom: function({_series, seriesIndex, dataPointIndex, w}) {
      const currentDate = new Date();
      const moscowTime = new Date(currentDate.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
      const date = new Date(moscowTime.setDate(moscowTime.getDate() - (6 - dataPointIndex)));
      const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

      let infoFields = '';
      console.log(series.value);
      for (let i = 0; i < series.value.length; i++) {
        infoFields += '<div class="flex items-center gap-2"><div class="rounded-full w-3 h-3" style="background: '+w.globals.colors[i]+';"></div>'+w.globals.seriesNames[i]+': <p class="font-bold ml-auto mr-0 pl-2">'+series.value[i].data[dataPointIndex]+'</p></div>';
      }
      return '<div class="backdrop-blur-sm shadow">' +
          '<div class="bg-themeBackgroundThird p-1 opacity-90">'+formattedDate+'</div>' +
          '<div class="bg-themeBackgroundThird p-1 opacity-75">' +
          infoFields +
          '</div>' +
          '</div>'
    },

  }
}

const series = ref([{
  name: 'Доход [АР]',
  data: [0,0,0,1,0,0,0],
}])

onMounted(() => {
  series.value = [{
    name: 'Доход [АР]',
    data: props?.sells?.map(i => i.total),
  }]
})
</script>

<template>
  <apexchart
      :key="series"
      width="100%"
      height="100%"
      type="area"
      :options="options"
      :series="series"
  ></apexchart>
</template>

<style scoped>

</style>