<template>
  <q-page class="flex items-center justify-start column" style="height: 180vh">
    <div
      class="head row flex flex-center"
      style="
        width: 100vw;
        font-size: 50px;
        font-weight: bold;
        margin-top: 50px;
        margin-bottom: 50px;
      "
    >
      <div>{{ title }}</div>
    </div>
    <hr style="width: 100vw; margin-bottom: 50px" />

    <div class="column flex flex-center">
      <div class="row">
        <div
          class="col"
          ref="chartRef1"
          style="width: 700px; height: 500px"
        ></div>
        <div
          class="col"
          ref="chartRef2"
          style="width: 700px; height: 500px"
        ></div>
      </div>
      <q-select
        class="row"
        v-model="acptedDnrNum"
        :options="[1, 5, 10, 20, 100]"
        label="Avg # of Acpted Dnr/req"
        filled
        style="width: 200px; margin-left: 10px; margin-top: 20px"
      />
    </div>

    <hr style="width: 100vw; margin-top: 50px; margin-bottom: 50px" />

    <div class="row">
      <div ref="chartRef3" style="width: 700px; height: 500px"></div>
      <div class="column">
        <q-select
          v-model="reqPerHspDialy"
          :options="[1, 5, 10, 20, 100]"
          label="# of Req/Hospital/Day"
          filled
          style="width: 200px; margin-left: 10px; margin-top: 20px"
        />
        <q-select
          v-model="acptedDnrNumCompare"
          :options="[1, 5, 10, 20, 100]"
          label="Avg # of Acpted Dnr/req"
          filled
          style="width: 200px; margin-left: 10px; margin-top: 20px"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, onUpdated, watch } from "vue";
import { googleCostRoughCalc, mapboxCostRoughCalc } from "../utils/index";

defineOptions({
  name: "IndexPage",
});
const title = ref("Map Module Cost Estimation Analysis");
const chartRef1 = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
// const chartIns = ref(null); // not working, will cause error when click legend
let chartIns1 = null;
let chartIns2 = null;
let chartIns3 = null;

const reqPerHspDialy = ref(10);
const acptedDnrNum = ref(10);
const acptedDnrNumCompare = ref(10);

const hospitalNum = [1, 5, 10, 50, 100];
const reqPerHospDialyList = [5, 10, 20, 50, 100];

function genCompareOption(_title, _acptedDnrNum) {
  return {
    title: {
      text: _title,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let tooltipText = `
        <div style="display: flex; justify-content: space-between;">
            <span style="flex: 1;"><b># of Hsp:</b> ${params[0].axisValue}<br/></span>
            <span style="flex: 1; text-align: center; margin-left:50px; display:none"><b># of Req/Hospital/Day:</b> ${reqPerHspDialy.value}</span>
            <span style="flex: 1; text-align: right; margin-left:50px;"><b>Total # of Req/Month:</b> ${params[0].axisValue * reqPerHspDialy.value * 30 * _acptedDnrNum}</span>
        </div>
        <hr>
    `;

        tooltipText += `
        <div style="display: flex; justify-content: space-between;">
            <span style="flex: 1;"><b>Platform</b></span>
            <span style="flex: 1; text-align: right; margin-left:50px;"><b>Cost/Month($)</b></span>
        </div><br/>
    `;

        params.forEach((param) => {
          tooltipText += `
            <div style="display: flex; justify-content: space-between;">
              <span style="flex: 1;">${param.marker} ${param.seriesName}</span>
                <span style="flex: 1; text-align: center;"></span>
                <b style="flex: 1; text-align: right;">${param.data !== null ? "$" + param.data : "Contact sales"}</b>
            </div><br/>
        `;
        });
        return tooltipText;
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "Save",
          name: "Line Chart",
          show: false,
        },
      },
    },

    legend: {
      bottom: 0,
      left: "center",
      data: ["Mapbox", "Google Map"],
    },
    xAxis: {
      type: "category",
      name: "# of Hsp",
      namelocation: "start",
      data: hospitalNum.map((num) => num.toString()),
    },
    yAxis: {
      type: "value",
      name: "Cost/Month($)",
    },
    series: [
      {
        name: "Mapbox",
        type: "line",
        data: hospitalNum.map((hospNum) => {
          const reqMonthly =
            reqPerHspDialy.value * hospNum * _acptedDnrNum * 30;
          return mapboxCostRoughCalc(reqMonthly);
        }),
      },
      {
        name: "Google Map",
        type: "line",
        data: hospitalNum.map((hospNum) => {
          const reqMonthly =
            reqPerHspDialy.value * hospNum * _acptedDnrNum * 30;
          return googleCostRoughCalc(reqMonthly);
        }),
      },
    ],
  };
}

function genOption(_title, _acptedDnrNum) {
  return {
    title: {
      text: _title,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let tooltipText = `<b># of Hsp:</b> ${params[0].axisValue}<br/><hr/>`;
        tooltipText += `
        <div style="display: flex; justify-content: space-between;">
            <span style="flex: 1;"><b># of Req/Hospital/Day</b></span>
            <span style="flex: 1; text-align: center; margin-left:50px;"><b>Total # of Req/Month</b></span>
            <span style="flex: 1; text-align: right; margin-left:50px;"><b>Cost/Month($)</b></span>
        </div><br/>
    `;

        params.forEach((param) => {
          tooltipText += `
            <div style="display: flex; justify-content: space-between;">
                <span style="flex: 1;">${param.marker} ${param.seriesName}</span>
                <span style="flex: 1; text-align: center;">${params[0].axisValue * param.seriesName * 30 * _acptedDnrNum}</span>
                <b style="flex: 1; text-align: right;">${param.data !== null ? "$" + param.data : "Contact sales"}</b>
            </div><br/>
        `;
        });
        return tooltipText;
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "Save",
          name: "Line Chart",
          show: false,
        },
      },
    },
    graphic: [
      {
        type: "text",
        left: 150, // Position horizontally
        bottom: 4, // Position vertically
        style: {
          text: "# of Req/Hospital/Day:", // Your legend title text
          fontSize: 16,
          // fontWeight: "lighter",
        },
      },
    ],
    legend: {
      // title: {
      //   text: "# of Req per Hospital per Day",
      //   left: "center",
      // },
      bottom: 1,
      left: 320,
      name: "# of Req per Hospital per Day",
      data: reqPerHospDialyList.map((num) => num.toString()),
    },
    xAxis: {
      type: "category",
      name: "# of Hsp",
      namelocation: "start",
      data: hospitalNum.map((num) => num.toString()),
    },
    yAxis: {
      type: "value",
      name: "Cost/Month($)",
    },
    series: reqPerHospDialyList.map((reqDaily) => {
      return {
        name: reqDaily.toString(),
        type: "line",
        data: hospitalNum.map((hospNum) => {
          const reqMonthly = reqDaily * hospNum * _acptedDnrNum * 30;
          return _title === "Google Map"
            ? googleCostRoughCalc(reqMonthly)
            : mapboxCostRoughCalc(reqMonthly);
        }),
      };
    }),
  };
}

watch(acptedDnrNum, (newVal) => {
  const option1 = genOption("Google Map", newVal);
  const option2 = genOption("Mapbox", newVal);

  option1 && chartIns1.setOption(option1);
  option2 && chartIns2.setOption(option2);
});

watch(acptedDnrNumCompare, (newVal) => {
  const option3 = genCompareOption("Mapbox v.s. Google Map", newVal);
  option3 && chartIns3.setOption(option3);
});

watch(reqPerHspDialy, (newVal) => {
  const option3 = genCompareOption(
    "Mapbox v.s. Google Map",
    acptedDnrNumCompare.value,
  );

  option3 && chartIns3.setOption(option3);
});

onMounted(() => {
  const option1 = genOption("Google Map", acptedDnrNum.value);
  const option2 = genOption("Mapbox", acptedDnrNum.value);
  const option3 = genCompareOption(
    "Mapbox v.s. Google Map",
    acptedDnrNumCompare.value,
  );
  chartIns1 = echarts.init(chartRef1.value);
  chartIns2 = echarts.init(chartRef2.value);
  chartIns3 = echarts.init(chartRef3.value);

  // chartIns.value = echarts.init(chartRef.value);

  option1 && chartIns1.setOption(option1);
  option2 && chartIns2.setOption(option2);
  option3 && chartIns3.setOption(option3);
});
</script>
