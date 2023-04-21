import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Tooltip,
  Cell,
} from "recharts";
import { CircularProgress, Typography } from "@mui/material";
import useFetchData from "./hooks/useFetchData";
import {
  NameType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip as MuiToolTip } from "@mui/material";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
interface CustomTooltipProps {
  active?: boolean;
  label?: any;
  payload?: Payload<any, NameType>[];
}

const CustomTooltip = ({ active, label, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const formattedLabel = new Date(label)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
      })
      .replace("/", "-");
    const formattedPayloads = payload.map((entry, index) => {
      if (entry.name === "cumulative_volume") {
        const formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(entry.value);
        return `Cumulative volume: ${formattedValue}`;
      }
      return null;
    });
    return (
      <div className="custom-tooltip">
        <div>{formattedLabel}</div>
        {formattedPayloads.map((formattedPayload, i) => (
          <div key={i}>{formattedPayload}</div>
        ))}
      </div>
    );
  }
  return null;
};

const SimpleBarChart = () => {
  const [focusBar, setFocusBar] = useState<null | number | undefined>(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  const data = useFetchData();

  const formatYAxisTick = (tickValue: number) => {
    const valueInMillions = tickValue / 1000000;
    return `$${valueInMillions}M`;
  };

  return (
    <div style={{ backgroundColor: "#111827", borderRadius: 10, width: 650 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            style={{
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 400,
              paddingLeft: 20,
              paddingTop: 20,
              paddingBottom: 10,
            }}
          >
            Cumulative Volume Over Time
          </Typography>

          <MuiToolTip title="The cumulative volume of the cross-chain transfer through the Axelar network">
            <InfoOutlinedIcon
              style={{
                color: "white",
                width: 18,
                paddingTop: 8,
                paddingLeft: 5,
              }}
            />
          </MuiToolTip>
        </div>
        <CloudDownloadOutlinedIcon
          style={{
            color: "white",
            width: 20,
            paddingTop: 8,
            paddingRight: 20,
          }}
          cursor="pointer"
        />
      </div>
      <hr />
      <ResponsiveContainer width="100%" height={350}>
        {data ? (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={0}
            barCategoryGap={0}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
                setMouseLeave(false);
              } else {
                setFocusBar(null);
                setMouseLeave(true);
              }
            }}
          >
            <CartesianGrid stroke="none" fill="#111827" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: "#ffffff", fontSize: 14 }}
              interval={3}
              tickFormatter={(timestamp) =>
                new Date(timestamp)
                  .toLocaleDateString("en-US", {
                    month: "numeric",
                    year: "numeric",
                  })
                  .replace("/", "-")
              }
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fill: "#ffffff", fontSize: 14 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="cumulative_volume" fill="#419FF0">
              {data
                ? data.map((entry, index) => (
                    <Cell
                      key={entry.timestamp}
                      fill={
                        focusBar === index || mouseLeave
                          ? "#419FF0"
                          : "rgba(43, 92, 231, 0.2)"
                      }
                    />
                  ))
                : null}
            </Bar>
          </BarChart>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 350,
            }}
          >
            <CircularProgress />
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
