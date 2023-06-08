import { View, Text, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { SVGRenderer, SkiaChart } from "@wuba/react-native-echarts";
import { Activity } from "../../../@types/activity";
import { ECBasicOption } from "echarts/types/dist/shared";
import { markerStore } from "../../../stores/markerStore";

echarts.use([SVGRenderer, LineChart, GridComponent, TooltipComponent]);
const E_HEIGHT = 300;
const E_WIDTH = Dimensions.get("window").width;
export default function ElevationChart({ activity }: { activity: Activity }) {
  const setMarker = markerStore((state) => state.setMarker);
  const chartData = activity.elevation.elevationPoints.map(
    (elevation, index) => ({
      value: [
        (
          activity.distance *
          (index / activity.elevation.elevationPoints.length)
        ).toFixed(0),
        elevation.toFixed(0),
      ],
      coord: activity.coordinates ? activity.coordinates[index] : null,
    })
  );
  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option: ECBasicOption = {
      grid: {
        right: "5%",
        left: "12%",
        top: "10%",
        bottom: "30%",
      },
      tooltip: {
        trigger: "axis",
        formatter(params: any) {
          setMarker(params[0].data.coord);
          function formatLabel() {
            let label = "Distance: ";
            if (params[0].axisValue < 1000) {
              label += `${params[0].axisValue} meters`;
            } else {
              label += `${(params[0].axisValue / 1000).toFixed(1)} kilometers`;
            }
            return `Elevation: ${params[0].data.value[1]} meters\n` + label;
          }
          return formatLabel();
        },
      },
      xAxis: {
        type: "value",
        scale: true,
        name: `Distance ${activity.distance < 1000 ? "(m)" : "(km)"}`,
        nameLocation: "middle",
        nameGap: 25,
        axisLabel: {
          formatter: (value: any) => {
            return value < 1000 ? value : value / 1000;
          },
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        name: "Elevation (m)",
      },
      series: [
        {
          data: chartData,
          type: "line",
          smooth: true,
          symbol: "none",
          symbolSize: 0,
          color: "rgba(255, 0, 0, 0.9)",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)",
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)",
              },
            ]),
          },
        },
      ],
    };
    let chart: echarts.ECharts | null = null;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "svg",
        width: E_WIDTH,
        height: E_HEIGHT,
      });
      chart.setOption(option);
      chart.getZr().on("dragend", function (event) {
        setMarker(null);
      });
    }
    return () => chart?.dispose();
  }, []);
  return <SkiaChart ref={skiaRef} />;
}
