export interface EnergyData {
  timestamp: string;
  consumption: number; // kWh
  cost: number; // INR
  peakLoad: number; // kW
}

export interface ForecastData extends EnergyData {
  predictedConsumption: number;
  predictedPeak: number;
  confidenceInterval: [number, number];
}

export interface SavingsInsight {
  title: string;
  description: string;
  potentialSavings: number;
  action: string;
}
