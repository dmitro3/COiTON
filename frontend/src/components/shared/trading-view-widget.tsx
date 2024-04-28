"use client";

import React from "react";
import { dummyCharts } from "@/constants";
import ReactApexChart from "react-apexcharts";

const TradingViewWidget = ({ title }: { title: string }) => {
  const [state]: any = React.useState({
    series: [
      {
        data: dummyCharts,
      },
    ],
    options: {
      colors: ["#3B82F6"],
      theme: {
        mode: "dark",
      },
      chart: {
        stacked: false,
        id: "realtime",
        height: 550,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000,
          },
        },
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      title: {
        text: title,
        align: "left",
        style: {
          fontSize: "17px",
          fontWeight: "600",
          color: "#fff",
          marginBottom: "10px",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return (val / 1000000).toFixed(1);
          },
        },
        title: {
          text: "Left title goes here",
        },
      },
      xaxis: {
        type: "datetime",
        title: {
          text: "Right title goes here",
        },
      },
      tooltip: {
        enabled: true,
      },
      grid: {
        borderColor: "rgba(255,255,255,0.1)",
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={450}
        />
      </div>
    </div>
  );
};

export default TradingViewWidget;
