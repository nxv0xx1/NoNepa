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
