<script setup lang="ts">
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
    custom: function({series, seriesIndex, dataPointIndex, w}) {
      const currentDate = new Date();
      const moscowTime = new Date(currentDate.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
      const date = new Date(moscowTime.setDate(moscowTime.getDate() - (6 - dataPointIndex)));
      const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

      let infoFields = '';
      for (let i = 0; i < shop.series.length; i++) {
        infoFields += '<div class="flex items-center gap-2"><div class="rounded-full w-3 h-3" style="background: '+w.globals.colors[i]+';"></div>'+w.globals.seriesNames[i]+': <p class="font-bold ml-auto mr-0 pl-2">'+shop.series[i].data[dataPointIndex]+'</p></div>';
      }
      return '<div class="backdrop-blur-sm">' +
          '<div class="bg-themeBackgroundThird p-2 opacity-90">'+formattedDate+'</div>' +
          '<div class="bg-themeBackgroundThird p-2 opacity-75">' +
          infoFields +
          '</div>' +
          '</div>'
    },

  }
}

const series = [{
  name: 'Продажи',
  data: [10, 41, 35, 51, 49, 62, 69, 91, 148].reverse(),
},{
  name: 'Посещения',
  data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
}]
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