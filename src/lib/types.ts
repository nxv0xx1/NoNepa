export interface InverterRule {
  minWatts: number;
  maxWatts: number;
  kva: number;
}

export interface BatteryRule {
  minWatts: number;
  maxWatts: number;
  minBackupHours: number;
  batteryAh: number;
  batteryVoltage: number;
}

export interface PanelRule {
  minWatts: number;
  maxWatts: number;
  averageDailyUseHours: number;
  panelCount: number;
  singlePanelWattage: number;
}

export interface AdminConfig {
  defaultWattages: { [key: string]: number };
  locations: { [key: string]: number };
  backupOptions: number[];
  packages: Package[];
  whatsapp: {
    contactName: string;
    number: string;
    message: string;
  };
  inverterRules: InverterRule[];
  batteryRules: BatteryRule[];
  panelRules: PanelRule[];
}

export interface Package {
  id: string;
  title: string;
  inverter: string;
  battery: string;
  panel: string;
  price: string;
  description: string;
  idealFor: string;
  imageUrl: string;
}

export interface CustomAppliance {
  id: string;
  name: string;
  wattage: number;
  quantity: number;
}

export interface AuditState {
  appliances: { [key: string]: number };
  customAppliances: CustomAppliance[];
  location: string;
  backupHours: number;
}

export interface AuditCalculations {
  totalWattage: number;
  dailyEnergyWh: number;
  dailyEnergyKWh: number;
  inverterSizeKW: number;
  inverterSizeKVA: number;
  batteryCapacityWh: number;
  batteryCapacityAh: number;
  batteryVoltage: number;
  panelCount: number;
  singlePanelWattage: number;
}
