export interface CumulativeVolume {
  timestamp: number;
  volume: number;
  cumulative_volume: number;
  num_txns: number;
}

export interface CumulativeVolumeWithMonthlyVolume extends CumulativeVolume {
  monthly_volume: number;
}
