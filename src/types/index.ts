export interface Property {
  id: string;
  name: string;
  address: string;
  deliveryInstructions: string;
  propertyUpdates: string;
  accessInformation: {
    code: string;
    additionalInfo?: string;
  };
  authorizedServices: string[];
  created_at?: string;
  updated_at?: string;
} 