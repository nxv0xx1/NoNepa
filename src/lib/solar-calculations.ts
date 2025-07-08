import type { AuditState, AuditCalculations } from './types';
import config from '@/data/admin-config.json';

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

  // 2. Size the Inverter based on rules
  const inverterRule = config.inverterRules.find(rule => totalWattage >= rule.minWatts && totalWattage < rule.maxWatts) 
    || config.inverterRules[config.inverterRules.length - 1];
  
  const inverterSizeKVA = inverterRule.kva;
  const inverterSizeKW = parseFloat((inverterSizeKVA * 0.8).toFixed(2));

  // 3. Size the Battery Bank based on rules
  const matchingBatteryRules = config.batteryRules
    .filter(rule => totalWattage >= rule.minWatts && totalWattage < rule.maxWatts)
    .sort((a, b) => b.minBackupHours - a.minBackupHours);
  
  const batteryRule = matchingBatteryRules.find(rule => audit.backupHours >= rule.minBackupHours) 
    || matchingBatteryRules.find(rule => rule.minBackupHours === 0) // Fallback to base for the wattage range
    || config.batteryRules[config.batteryRules.length - 1]; // Absolute fallback

  const batteryCapacityAh = batteryRule.batteryAh;
  const batteryVoltage = batteryRule.batteryVoltage;
  
  // 4. Size the Solar Panel Array based on rules
  const panelRule = config.panelRules.find(rule => totalWattage >= rule.minWatts && totalWattage < rule.maxWatts) 
    || config.panelRules[config.panelRules.length - 1];

  const { panelCount, singlePanelWattage, averageDailyUseHours } = panelRule;
  
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
