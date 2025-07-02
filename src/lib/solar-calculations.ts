import type { AuditState, AuditCalculations } from './types';
import config from '@/data/admin-config.json';

// Constants
const BATTERY_DOD_LIMIT = 0.50; // Depth of Discharge limit
const AUTONOMY_DAYS = 1; // Days of backup power
const PANEL_DEGRADATION_FACTOR = 0.80; // Accounts for real-world conditions

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

  // 2. Calculate Daily Energy Consumption (Watt-hours)
  // This is a simplification; a real audit would ask for hours of use per appliance.
  // Here we assume an average of 4 hours of use for all appliances.
  const averageDailyUseHours = 4;
  const dailyEnergyWh = totalWattage * averageDailyUseHours;
  const dailyEnergyKWh = dailyEnergyWh / 1000;

  // 3. Size the Inverter based on total wattage bands
  let inverterSizeKVA: number;

  if (totalWattage > 0 && totalWattage <= 1000) { // For loads of 200W – 1000W, suggest inverter size of 0.8kVA – 1.5kVA
    inverterSizeKVA = 1.5;
  } else if (totalWattage > 1000 && totalWattage <= 2000) { // For loads of 1000W – 2000W, suggest inverter size of 1.5kVA – 2.5kVA
    inverterSizeKVA = 2.5;
  } else if (totalWattage > 2000 && totalWattage <= 3000) { // For loads of 2000W – 3000W, suggest inverter size of 3.5kVA
    inverterSizeKVA = 3.5;
  } else if (totalWattage > 3000 && totalWattage <= 5000) { // For loads of 3000W – 5000W, suggest inverter size of 5kVA
    inverterSizeKVA = 5;
  } else if (totalWattage > 5000 && totalWattage <= 7000) { // For loads of 5000W – 7000W, suggest inverter size of 7.5kVA – 10kVA
    inverterSizeKVA = 7.5;
  } else if (totalWattage > 7000 && totalWattage <= 10000) { // For loads of 7000W – 10,000W, suggest inverter size of 10kVA – 15kVA
    inverterSizeKVA = 10;
  } else if (totalWattage > 10000) { // For loads above 10,000W, suggest inverter size of 15kVA and above
    inverterSizeKVA = 15;
  } else {
    inverterSizeKVA = 0; // Default for no load
  }

  // Assuming a power factor of 0.8 to convert kVA to kW for battery calculation
  const inverterSizeKW = parseFloat((inverterSizeKVA * 0.8).toFixed(2));

  // 4. Size the Battery Bank
  const requiredBatteryWh = (dailyEnergyWh * AUTONOMY_DAYS) / BATTERY_DOD_LIMIT;
  const backupEnergyWh = (totalWattage * audit.backupHours) / BATTERY_DOD_LIMIT;
  
  // Use the larger of the two to ensure both daily need and backup are met
  const batteryCapacityWh = Math.max(requiredBatteryWh, backupEnergyWh);
  
  // Determine battery voltage based on inverter size
  const batteryVoltage = inverterSizeKW <= 2.5 ? 12 : inverterSizeKW <= 5 ? 24 : 48;
  const batteryCapacityAh = parseFloat((batteryCapacityWh / batteryVoltage).toFixed(0));

  // 5. Size the Solar Panel Array
  const sunHours = config.locations[audit.location as keyof typeof config.locations] || 5; // Default to 5 hours
  const requiredPanelWattage = dailyEnergyWh / (sunHours * PANEL_DEGRADATION_FACTOR);
  
  // Round up to a practical panel size (e.g., 350W, 450W, 550W)
  let singlePanelWattage = 450;
  if (requiredPanelWattage < 1000) singlePanelWattage = 350;
  if (requiredPanelWattage > 4000) singlePanelWattage = 550;

  const panelCount = Math.ceil(requiredPanelWattage / singlePanelWattage);

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
