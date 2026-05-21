export type SystemSetting = {
  id: number;
  name: string;
  value: string;
};

// export type SystemSettingsResponse = SystemSetting[];
export type SystemSettingsResponse = {
  isMaintenance: boolean;
};
