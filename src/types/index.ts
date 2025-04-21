export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  unit_count?: number;
  property_type?: string;
  authorized_services: string[];
  instructions?: PropertyInstructions;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyInstructions {
  id?: string;
  property_id?: string;
  package_location?: string;
  access_code?: string;
  access_notes?: string;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
} 