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
      chart: {
        stacked: false,
        id: "realtime",
        height: 350,
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
        // curve: "smooth",
      },
      markers: {
        size: 0,
      },
      title: {
        text: title,
        align: "left",
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
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: "Price",
        },
      },
      xaxis: {
        type: "datetime",
      },
      tooltip: {
        // enabled: false,
      },
      grid: {
        borderColor: "rgba(255,255,255,0.3)",
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
          height={350}
        />
      </div>
    </div>
  );
};

export default TradingViewWidget;

// import React, { useEffect, useState } from "react";
// import { createChart } from "lightweight-charts";

// const initialData: any = [
//   { value: 0, time: 1642425322 },
//   { value: 0, time: 1642511722 },
//   { value: 24, time: 1642598122 },
//   { value: 25, time: 3434200785 },
//   { value: 50, time: 1642943722 },
//   { value: 9, time: 2310781394 },
// ];

// const TradingViewWidget = () => {
//   const [data, setData] = useState(initialData);

//   useEffect(() => {
//     const chartOptions: any = {
//       layout: {
//         textColor: "#ffffff",
//         background: {
//           type: "outline",
//           color: "#01040A",
//         },
//       },
//     };

//     const chart = createChart(
//       document.getElementById("container") as any,
//       chartOptions
//     );
//     const candlestickSeries = chart.addBaselineSeries({
//       baseValue: { type: "price", price: 25 },
//       topLineColor: "rgba( 38, 166, 154, 1)",
//       topFillColor1: "rgba( 38, 166, 154, 0.28)",
//       topFillColor2: "rgba( 38, 166, 154, 0.05)",
//       bottomLineColor: "rgba( 239, 83, 80, 1)",
//       bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
//       bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
//     });

//     const sortedData = data?.sort((a: any, b: any) => a.time - b.time);

//     candlestickSeries.setData(sortedData);

//     chart.timeScale().fitContent();

//     // Cleanup function
//     return () => {
//       chart.remove();
//     };
//   }, [data]);

//   return <div id="container" className="w-full h-[450px] md:h-[650px]"></div>;
// };

// export default TradingViewWidget;
