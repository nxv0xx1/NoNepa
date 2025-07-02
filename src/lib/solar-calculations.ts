import type { AuditState, AuditCalculations } from './types';
import config from '@/data/admin-config.json';

// Constants from the original logic, kept for reference or potential future fallback.
// const BATTERY_DOD_LIMIT = 0.50; 
// const AUTONOMY_DAYS = 1; 
// const PANEL_DEGRADATION_FACTOR = 0.80;

export function calculateSolarNeeds(audit: AuditState): AuditCalculations {
  // 1. Calculate Total Load (Wattage)
  const applianceWattage = Object.entries(audit.appliances).reduce((total, [name, quantity]) => {
    const wattage = config.defaultWattages[name as keyof typeof config.defaultWattages] || 0;
    return total + (wattage * quantity);
  }, 0);

  const customApplianceWattage = audit.customAppliances.reduce((total, app) => {
    return total + (app.wattage * app.quantity);
  }, 0);

  const totalWattage = applianceWattage + customApplianceWattage;

  // 2. Size the Inverter based on total wattage bands
  let inverterSizeKVA: number;
  if (totalWattage > 0 && totalWattage <= 1000) {
    inverterSizeKVA = 1.5;
  } else if (totalWattage > 1000 && totalWattage <= 2000) {
    inverterSizeKVA = 2.5;
  } else if (totalWattage > 2000 && totalWattage <= 3000) {
    inverterSizeKVA = 3.5;
  } else if (totalWattage > 3000 && totalWattage <= 5000) {
    inverterSizeKVA = 5;
  } else if (totalWattage > 5000 && totalWattage <= 7000) {
    inverterSizeKVA = 7.5;
  } else if (totalWattage > 7000 && totalWattage <= 10000) {
    inverterSizeKVA = 10;
  } else if (totalWattage > 10000) {
    inverterSizeKVA = 15;
  } else {
    inverterSizeKVA = 0;
  }
  const inverterSizeKW = parseFloat((inverterSizeKVA * 0.8).toFixed(2));

  // 3. Size the Battery Bank based on new rules
  let batteryCapacityAh: number;
  let batteryVoltage: number;

  if (totalWattage <= 500) {
    batteryCapacityAh = 200;
    batteryVoltage = 24;
  } else if (totalWattage <= 1000) {
    batteryCapacityAh = 400;
    batteryVoltage = 24;
  } else if (totalWattage <= 2000) {
    batteryCapacityAh = 600;
    batteryVoltage = 24;
  } else if (totalWattage <= 3000) {
    batteryCapacityAh = 1000;
    batteryVoltage = inverterSizeKW > 2.5 ? 48 : 24; // Use inverter size to decide voltage
  } else if (totalWattage <= 5000) {
    batteryCapacityAh = 1500;
    batteryVoltage = 48;
  } else { // For loads > 5000W
    batteryCapacityAh = 2000; // Use a high default for "custom-sized" to ensure UI works
    batteryVoltage = 48;
  }

  // Override with higher capacity based on backup hour requirements
  if (audit.backupHours >= 24 || (totalWattage > 5000)) {
      batteryCapacityAh = Math.max(batteryCapacityAh, 2000);
      batteryVoltage = 48;
  } else if (audit.backupHours >= 12 && totalWattage > 2000) {
      batteryCapacityAh = Math.max(batteryCapacityAh, 1000);
      batteryVoltage = inverterSizeKW > 2.5 ? 48 : 24;
  }

  // 4. Size the Solar Panel Array based on new rules
  let panelCount: number;
  let singlePanelWattage: number;
  let averageDailyUseHours: number;

  if (totalWattage <= 500) {
    averageDailyUseHours = 6;
    panelCount = 2;
    singlePanelWattage = Math.ceil((700 / panelCount) / 50) * 50; // Use lower bound of 700W total
  } else if (totalWattage <= 1000) {
    averageDailyUseHours = 7;
    panelCount = 3;
    singlePanelWattage = Math.ceil((1200 / panelCount) / 50) * 50; // Use lower bound of 1200W total
  } else if (totalWattage <= 2000) {
    averageDailyUseHours = 10;
    panelCount = 5;
    singlePanelWattage = Math.ceil((2000 / panelCount) / 50) * 50; // Use lower bound of 2000W total
  } else if (totalWattage <= 3000) {
    averageDailyUseHours = 12;
    panelCount = 8;
    singlePanelWattage = Math.ceil((3500 / panelCount) / 50) * 50; // Use lower bound of 3500W total
  } else if (totalWattage <= 7000) {
    averageDailyUseHours = 12;
    panelCount = 10;
    singlePanelWattage = Math.ceil((5000 / panelCount) / 50) * 50; // Use lower bound of 5000W total
  } else { // > 7000W
    averageDailyUseHours = 12;
    panelCount = 15;
    singlePanelWattage = Math.ceil((8000 / panelCount) / 50) * 50; // Use lower bound of 8000W total
  }

  // 5. Calculate final display values
  const dailyEnergyWh = totalWattage * averageDailyUseHours;
  const dailyEnergyKWh = dailyEnergyWh / 1000;
  const batteryCapacityWh = batteryCapacityAh * batteryVoltage;

  return {
    totalWattage,
    dailyEnergyWh,
    dailyEnergyKWh,
    inverterSizeKW,
    inverterSizeKVA,
    batteryCapacityWh,
    batteryCapacityAh,
    batteryVoltage,
    panelCount,
    singlePanelWattage,
  };
}
