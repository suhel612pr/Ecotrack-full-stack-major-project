export type WasteCategory = 'recyclable' | 'organic' | 'landfill' | 'hazardous';

export interface SmartBin {
  id: string;
  name: string;
  address: string;
  category: WasteCategory;
  fillLevel: number; // percentage, e.g. 85
  temperature: number; // celsius
  batteryLevel: number; // percentage
  lat: number;
  lng: number;
  lastEmptied: string;
  signalStrength?: string;
  sensorHealth?: string;
  fireAlert?: boolean;
  maintenanceStatus?: string;
}

export interface CivicReport {
  id: string;
  citizenName: string;
  title: string;
  description: string;
  category: WasteCategory;
  location: string;
  lat: number;
  lng: number;
  status: 'pending' | 'dispatched' | 'completed';
  assignedWorkerId?: string;
  imageUrl?: string;
  greenPoints: number;
  createdAt: string;
}

export interface WorkerTask {
  id: string;
  binId?: string;
  reportId?: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  type: 'bin-collection' | 'illegal-dumping' | 'hazardous-spill';
}

export interface UserProfile {
  email: string;
  role: 'citizen' | 'worker' | 'supervisor' | 'admin' | 'superadmin';
  name: string;
  phone?: string;
  address?: string;
  points: number;
  avatarUrl?: string;
}

export interface WasteAnalysisResponse {
  itemName: string;
  category: WasteCategory;
  confidence: number;
  recyclable: boolean;
  greenPoints: number;
  binType: string;
  disposalInstructions: string;
  materialsDetected: string[];
  co2SavedKg: number;
}

export interface AIWasteScan {
  id: string;
  itemName: string;
  category: WasteCategory;
  confidence: number;
  recyclable: boolean;
  greenPoints: number;
  binType: string;
  disposalInstructions: string;
  materialsDetected: string[];
  co2SavedKg: number;
  imageUrl?: string;
  createdAt: string;
}

