import { View, Text, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { SVGRenderer, SkiaChart } from "@wuba/react-native-echarts";
import { Activity } from "../../../@types/activity";
import { ECBasicOption } from "echarts/types/dist/shared";

echarts.use([SVGRenderer, LineChart, GridComponent, TooltipComponent]);
const E_HEIGHT = 400;
const E_WIDTH = Dimensions.get("window").width;
export default function ElevationChart({ activity }: { activity: Activity }) {
  const chartData = activity.elevation.elevationPoints.map(
    (elevation, index) => ({
      value: [
        activity.distance * (index / activity.elevation.elevationPoints.length),
        elevation,
      ],
      coord: activity.coordinates ? activity.coordinates[index] : null,
    })
  );

  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option: ECBasicOption = {
      grid: {
        right: "5%",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
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
    }
    return () => chart?.dispose();
  }, []);
  return (
    <>
      <SkiaChart ref={skiaRef} />
    </>
  );
}
