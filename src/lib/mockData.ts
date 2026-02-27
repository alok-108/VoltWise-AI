import { EnergyData, ForecastData } from "../types";
import { addHours, format, startOfToday } from "date-fns";

export const generateMockData = (): EnergyData[] => {
  const data: EnergyData[] = [];
  const today = startOfToday();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = format(addHours(today, i), "yyyy-MM-dd HH:mm");
    // Simulate typical commercial building load (peaks at 10am-4pm)
    const hour = i;
    const baseLoad = 50;
    const peakFactor = hour >= 9 && hour <= 17 ? 2.5 : 1.0;
    const randomNoise = Math.random() * 10;
    const consumption = baseLoad * peakFactor + randomNoise;
    
    data.push({
      timestamp,
      consumption,
      cost: consumption * 8.5, // Avg commercial rate in India
      peakLoad: consumption * 1.2,
    });
  }
  return data;
};

export const generateForecast = (actualData: EnergyData[]): ForecastData[] => {
  return actualData.map(d => ({
    ...d,
    predictedConsumption: d.consumption * (0.95 + Math.random() * 0.1),
    predictedPeak: d.peakLoad * (0.95 + Math.random() * 0.1),
    confidenceInterval: [d.consumption * 0.9, d.consumption * 1.1],
  }));
};
