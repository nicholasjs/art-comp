import { useState, useEffect } from "react";
import {
  CumulativeVolume,
  CumulativeVolumeWithMonthlyVolume,
} from "../types/types";

const API_ENDPOINT = "https://api.axelarscan.io/cross-chain/cumulative-volume";
const API_HEADERS = { "Content-Type": "application/json" };

const useFetchData = (): CumulativeVolume[] => {
  const [data, setData] = useState<CumulativeVolume[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: API_HEADERS,
        });
        const volumedata = await response.json();
        const monthlyVolumeData = calculateMonthlyVolume(volumedata.data);
        setData(monthlyVolumeData);
      } catch (error) {
        console.error(error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const calculateMonthlyVolume = (
    data: CumulativeVolume[]
  ): CumulativeVolumeWithMonthlyVolume[] => {
    return data.map((entry, index, array) => {
      if (index === 0) {
        return { ...entry, monthly_volume: entry.cumulative_volume };
      } else {
        const previousEntry = array[index - 1];
        const monthlyVolume =
          entry.cumulative_volume - previousEntry.cumulative_volume;
        return { ...entry, monthly_volume: monthlyVolume };
      }
    });
  };

  return data;
};

export default useFetchData;
