import { getSupabase, isSupabaseActive } from './supabaseClient';
import { SmartBin, CivicReport, WorkerTask, UserProfile, WasteAnalysisResponse, WasteCategory, AIWasteScan, Vehicle } from './types';

// Default mock datasets for offline/local simulation
const DEFAULT_BINS: SmartBin[] = [
  { id: 'bin-101', name: 'Smart Bin SB-101', address: '120 Civic Center Plaza', category: 'recyclable', fillLevel: 42, temperature: 21.5, batteryLevel: 94, lat: 37.7785, lng: -122.4192, lastEmptied: '2026-07-06 08:30', signalStrength: 'Excellent', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' },
  { id: 'bin-102', name: 'Smart Bin SB-102', address: '450 Market St (Transit Hub)', category: 'landfill', fillLevel: 88, temperature: 24.1, batteryLevel: 89, lat: 37.7812, lng: -122.4115, lastEmptied: '2026-07-05 14:15', signalStrength: 'Good', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' },
  { id: 'bin-103', name: 'Smart Bin SB-103', address: 'Union Square East', category: 'recyclable', fillLevel: 76, temperature: 22.8, batteryLevel: 12, lat: 37.7878, lng: -122.4074, lastEmptied: '2026-07-06 10:00', signalStrength: 'Degraded', sensorHealth: 'degraded', fireAlert: false, maintenanceStatus: 'required' },
  { id: 'bin-104', name: 'Smart Bin SB-104', address: '820 Mission St (Central Park)', category: 'organic', fillLevel: 92, temperature: 28.3, batteryLevel: 81, lat: 37.7841, lng: -122.4045, lastEmptied: '2026-07-06 12:45', signalStrength: 'Excellent', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' },
  { id: 'bin-105', name: 'Smart Bin SB-105', address: 'Golden Gate Ave & Hyde St', category: 'hazardous', fillLevel: 15, temperature: 19.4, batteryLevel: 98, lat: 37.7818, lng: -122.4168, lastEmptied: '2026-07-04 09:00', signalStrength: 'Excellent', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' },
  { id: 'bin-106', name: 'Smart Bin SB-106', address: 'Civic Park South Trail', category: 'organic', fillLevel: 31, temperature: 20.2, batteryLevel: 74, lat: 37.7761, lng: -122.4231, lastEmptied: '2026-07-06 16:30', signalStrength: 'Good', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' },
  { id: 'bin-107', name: 'Smart Bin SB-107', address: 'Jefferson St & Taylor St (Fisherman Wharf)', category: 'landfill', fillLevel: 82, temperature: 25.0, batteryLevel: 68, lat: 37.8080, lng: -122.4150, lastEmptied: '2026-07-06 19:15', signalStrength: 'Good', sensorHealth: 'healthy', fireAlert: false, maintenanceStatus: 'none' }
];

const DEFAULT_REPORTS: CivicReport[] = [
  {
    id: 'rep-501',
    citizenName: 'Sarah Jenkins',
    title: 'Overflowing Recyclables near Bus Shelter',
    description: 'The recycling bin near the bus shelter on Market street is overflowing with plastic bottles. Wind is blowing them onto the street.',
    category: 'recyclable',
    location: '450 Market St Transit Stop',
    lat: 37.7814,
    lng: -122.4110,
    status: 'pending',
    greenPoints: 25,
    createdAt: '2026-07-07 08:15'
  },
  {
    id: 'rep-502',
    citizenName: 'Michael Chen',
    title: 'Illegal Dumping of Construction Waste',
    description: 'Someone dumped several drywall boards and paint cans on the side of Golden Gate Ave near Hyde St. Blockade of pedestrian pathway.',
    category: 'hazardous',
    location: 'Golden Gate Ave & Hyde St',
    lat: 37.7820,
    lng: -122.4172,
    status: 'dispatched',
    assignedWorkerId: 'worker-2',
    greenPoints: 50,
    createdAt: '2026-07-07 09:30'
  }
];

const DEFAULT_TASKS: WorkerTask[] = [
  {
    id: 'task-001',
    binId: 'bin-104',
    title: 'Empty Full Organic Bin SB-104',
    description: 'Smart Bin SB-104 has reached critical fill level (92%). Please collect and sanitize.',
    location: '820 Mission St (Central Park)',
    lat: 37.7841,
    lng: -122.4045,
    priority: 'high',
    status: 'pending',
    type: 'bin-collection'
  },
  {
    id: 'task-002',
    reportId: 'rep-502',
    title: 'Illegal Dumping & Hazardous Remediation',
    description: 'Clear drywall and paint cans reported by Michael Chen. Blockage on Golden Gate Ave & Hyde St.',
    location: 'Golden Gate Ave & Hyde St',
    lat: 37.7820,
    lng: -122.4172,
    priority: 'medium',
    status: 'in-progress',
    type: 'illegal-dumping'
  },
  {
    id: 'task-003',
    binId: 'bin-102',
    title: 'Urgent Collection SB-102',
    description: 'SB-102 Fill level is 88%. Needs collection on regular route.',
    location: '450 Market St (Transit Hub)',
    lat: 37.7812,
    lng: -122.4115,
    priority: 'high',
    status: 'pending',
    type: 'bin-collection'
  }
];

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: 'v-14', name: 'EV-TRUCK-14', model: 'MACK LR Electric', type: 'EV-Truck', battery_level: 92, lat: 37.7780, lng: -122.4120, status: 'Available' },
  { id: 'v-11', name: 'EV-TRUCK-11', model: 'BYD 8R Heavy Duty', type: 'Heavy-Duty', battery_level: 78, lat: 37.7830, lng: -122.4090, status: 'Collecting' }
];

// LocalStorage helpers to simulate database persistence in offline mode
const loadLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(`ecotrack_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const saveLocal = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`ecotrack_${key}`, JSON.stringify(value));
};

// PRESET AI WASTE ANALYSES
const PRESET_ANALYSES: Record<string, WasteAnalysisResponse> = {
  'plastic_bottle': {
    itemName: 'PET Plastic Water Bottle',
    category: 'recyclable',
    confidence: 0.98,
    recyclable: true,
    greenPoints: 15,
    binType: 'Blue Recycling Bin (Plastics & Cans)',
    disposalInstructions: 'Rinse out any remaining liquid, compress the bottle to save collection volume, and replace the cap before depositing.',
    materialsDetected: ['Polyethylene Terephthalate (PET 1)', 'Polypropylene (Cap)'],
    co2SavedKg: 0.12
  },
  'banana_peel': {
    itemName: 'Organic Food Scraps (Banana Peel)',
    category: 'organic',
    confidence: 0.95,
    recyclable: false,
    greenPoints: 10,
    binType: 'Green Organics / Compost Bin',
    disposalInstructions: 'Deposit directly into the green compost bin. Do not dispose in standard plastic bags — use certified compostable liners only.',
    materialsDetected: ['Biodegradable Organic Matter', 'Potassium-rich fiber'],
    co2SavedKg: 0.08
  },
  'cardboard_box': {
    itemName: 'Corrugated Cardboard Shipping Box',
    category: 'recyclable',
    confidence: 0.97,
    recyclable: true,
    greenPoints: 20,
    binType: 'Blue Recycling Bin (Paper & Cardboard)',
    disposalInstructions: 'Flatten completely to optimize collection container space. Remove heavy adhesive tape or packaging stickers if possible.',
    materialsDetected: ['Unbleached Kraft Paperboard', 'Cellulose Fiber'],
    co2SavedKg: 0.25
  },
  'broken_glass': {
    itemName: 'Tempered Plate Glass Shards',
    category: 'landfill',
    confidence: 0.91,
    recyclable: false,
    greenPoints: 5,
    binType: 'Black Landfill Waste Bin',
    disposalInstructions: 'Wrap securely in thick newspaper or durable cardboard to protect city sanitation workers, label as "broken glass" if possible, then deposit in landfill waste.',
    materialsDetected: ['Soda-lime Glass', 'Silica'],
    co2SavedKg: 0.0
  },
  'alkaline_battery': {
    itemName: 'AA Alkaline Household Battery',
    category: 'hazardous',
    confidence: 0.96,
    recyclable: false,
    greenPoints: 40,
    binType: 'Red Hazard / E-Waste Depot Bin',
    disposalInstructions: 'Do NOT throw in municipal trash. Recycle at designated battery drop-off retail hubs or municipal electronic hazardous waste events.',
    materialsDetected: ['Manganese Dioxide', 'Zinc', 'Steel', 'Potassium Hydroxide Electrolyte'],
    co2SavedKg: 0.45
  }
};

/**
 * Clean & resilient service layer managing all transactions with Supabase and local/offline fallbacks.
 */
export const SupabaseService = {
  // --- AUTH SERVICES ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        // Do not throw if user not found, just return null.
        if (error.code !== 'PGRST116') throw new Error(`Supabase profile query failed: ${error.message}`);
      }
      if (data) {
        return {
          id: data.id,
          email: data.email || '',
          role: data.role as 'citizen' | 'worker' | 'supervisor' | 'admin' || 'citizen',
          name: data.name || '',
          points: data.points || 0,
          avatarUrl: data.avatar_url || '',
          status: data.status || 'Active'
        };
      }
      return null;
    }
    return null;
  },

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          points: profile.points,
          avatar_url: profile.avatarUrl
        });
      if (error) {
        throw new Error(`Supabase profile upsert failed: ${error.message}`);
      }
    } else {
      // Local mode doesn't persist profile changes beyond the session.
    }
  },

  async getUsers(): Promise<UserProfile[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw new Error(`Supabase profiles query failed: ${error.message}`);
      }
      if (data) {
        return data.map(d => ({
          id: d.id,
          email: d.email || '',
          role: d.role as 'citizen' | 'worker' | 'supervisor' | 'admin' || 'citizen',
          name: d.name || '',
          points: d.points || 0,
          avatarUrl: d.avatar_url || '',
          status: d.status || 'Active'
        }));
      }
      return [];
    }
    // Mock data for local/offline mode
    return [
        { id: 'user-1', email: 'citizen@test.com', role: 'citizen', name: 'John Doe', points: 120, avatarUrl: '', status: 'Active' },
        { id: 'user-2', email: 'worker@test.com', role: 'worker', name: 'Jane Smith', points: 450, avatarUrl: '', status: 'Active' },
    ];
  },

  async updateUserRole(userId: string, role: UserProfile['role']): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) throw new Error(`Supabase role update failed: ${error.message}`);
    }
  },

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
      if (error) throw new Error(`Supabase status update failed: ${error.message}`);
    }
  },

  async uploadScanImage(imageFile: File, userId: string): Promise<string> {
    const supabase = getSupabase();
    if (!isSupabaseActive() || !supabase) {
      // In local mode, return a placeholder or empty string as we can't upload.
      return '';
    }

    const safeName = imageFile.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    const filePath = `${userId}/${Date.now()}-${safeName}`;

    try {
      const { error } = await supabase.storage.from('scan-images').upload(filePath, imageFile, {
        upsert: true,
        contentType: imageFile.type || 'image/jpeg'
      });
      if (error) {
        console.warn('Scan image upload failed:', error.message);
        return '';
      }
      const { data } = supabase.storage.from('scan-images').getPublicUrl(filePath);
      return data?.publicUrl || '';
    } catch (err) {
      console.warn('Scan image upload exception:', err);
      return '';
    }
  },

  // --- SMART BINS ---
  async getSmartBins(): Promise<SmartBin[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase
        .from('smart_bins') // This table name must match your DB schema
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.warn('Supabase smart_bins query failed:', error.message);
        if (error.message.includes('Could not find') || error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          (window as any).supabaseSchemaMissing = true;
        }
        throw new Error(`Supabase smart_bins query failed: ${error.message}`);
      }
      if (!data) {
        throw new Error('Supabase smart_bins query returned no data');
      }
      // Map snake_case from DB to camelCase for the app
      return (data as any[]).map(b => ({ ...b, fillLevel: b.fill_level, batteryLevel: b.battery_level, lastEmptied: b.last_emptied, signalStrength: b.signal_strength, sensorHealth: b.sensor_health, fireAlert: b.fire_alert, maintenanceStatus: b.maintenance_status }));
    } 
    // Return mock data if offline
    return loadLocal('bins', DEFAULT_BINS);
  },

  async addBin(bin: Partial<SmartBin>): Promise<SmartBin> {
    const newBin: SmartBin = {
      id: `local-${Date.now()}`, // Temporary ID for local state, DB will generate real one
      name: bin.name || 'New Smart Bin',
      address: bin.address || 'Civic bounds',
      category: bin.category || 'recyclable',
      fillLevel: bin.fillLevel ?? Math.floor(Math.random() * 20),
      temperature: 20.0,
      batteryLevel: 100,
      lat: bin.lat || 37.7749,
      lng: bin.lng || -122.4194,
      lastEmptied: 'Just Added',
      signalStrength: 'Excellent',
      sensorHealth: 'healthy',
      fireAlert: false,
      maintenanceStatus: 'none'
    };

    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('smart_bins').insert({
        name: newBin.name,
        address: newBin.address,
        category: newBin.category,
        fill_level: newBin.fillLevel, // Ensure snake_case for DB columns
        temperature: newBin.temperature,
        battery_level: newBin.batteryLevel, // Ensure snake_case for DB columns
        lat: newBin.lat,
        lng: newBin.lng,
        last_emptied: newBin.lastEmptied, // Ensure snake_case for DB columns
        signal_strength: newBin.signalStrength, // Ensure snake_case for DB columns
        sensor_health: newBin.sensorHealth, // Ensure snake_case for DB columns
        fire_alert: newBin.fireAlert, // Ensure snake_case for DB columns
        maintenance_status: newBin.maintenanceStatus // Ensure snake_case for DB columns
      });
      if (error) {
        throw new Error(`Supabase bin insert failed: ${error.message}`);
      }
    } else {
      const bins = loadLocal('bins', DEFAULT_BINS);
      bins.push(newBin);
      saveLocal('bins', bins);
    }
    return newBin;
  },

  async deleteBin(id: string): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('smart_bins').delete().eq('id', id);
      if (error) {
        throw new Error(`Supabase bin delete failed: ${error.message}`);
      }
    } else {
      const bins = loadLocal('bins', DEFAULT_BINS).filter(b => b.id !== id);
      saveLocal('bins', bins);
    }
  },

  // --- CIVIC REPORTS ---
  async getCivicReports(): Promise<CivicReport[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase reports query failed:', error.message);
        if (error.message.includes('Could not find') || error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          (window as any).supabaseSchemaMissing = true;
        }
        throw new Error(`Supabase reports query failed: ${error.message}`);
      }
      if (!data) {
        throw new Error('Supabase reports query returned no data');
      }
      // Map snake_case from DB to camelCase for the app
      return (data as any[]).map(r => ({ ...r, citizenName: r.citizen_name, imageUrl: r.image_url, greenPoints: r.green_points, createdAt: r.created_at, assignedWorkerId: r.assigned_worker_id }));
    } 
    return loadLocal('reports', DEFAULT_REPORTS);
  },

  async addReport(report: Partial<CivicReport>): Promise<CivicReport> {
    const newReport: CivicReport = {
      citizenName: report.citizenName || 'Anonymous Citizen',
      id: `local-${Date.now()}`, // Temporary ID for local state, DB will generate real one
      title: report.title || 'Civic Report',
      description: report.description || '',
      category: report.category || 'recyclable',
      location: report.location || 'Municipal Center',
      lat: report.lat || 37.7749 + (Math.random() - 0.5) * 0.02,
      lng: report.lng || -122.4194 + (Math.random() - 0.5) * 0.02,
      status: 'pending',
      imageUrl: report.imageUrl,
      greenPoints: report.category === 'hazardous' ? 50 : 25,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('reports').insert({
        citizen_name: newReport.citizenName, // snake_case
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        location: newReport.location,
        lat: newReport.lat,
        lng: newReport.lng,
        status: newReport.status,
        image_url: newReport.imageUrl, // snake_case
        green_points: newReport.greenPoints, // snake_case
        created_at: newReport.createdAt // snake_case
      });
      if (error) {
        throw new Error(`Supabase report insert failed: ${error.message}`);
      }
    } else {
      const reports = loadLocal('reports', DEFAULT_REPORTS);
      reports.unshift(newReport);
      saveLocal('reports', reports);
    }
    return newReport;
  },

  async dispatchReport(reportId: string, workerId: string, priority: 'low' | 'medium' | 'high'): Promise<WorkerTask> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      // 1. Fetch the specific report to get its details
      const { data: report, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError || !report) {
        throw new Error(`Failed to fetch report with ID ${reportId}: ${fetchError?.message || 'Not found'}`);
      }

      const newTask: WorkerTask = { // Create the new task based on the fetched report
        id: `task-${Date.now()}`,
        reportId: reportId,
        title: `Dispatch: ${report?.title || 'Reported Incident'}`,
        description: `Reported by ${report?.citizenName || 'Citizen'}: ${report?.description || ''}`,
        location: report?.location || 'Municipal Location',
        lat: report?.lat || 37.7749,
        lng: report?.lng || -122.4194,
        priority,
        status: 'pending',
        type: report?.category === 'hazardous' ? 'hazardous-spill' : 'illegal-dumping'
      };

      try {
        const { error: updateError } = await supabase.from('reports').update({ status: 'dispatched', assigned_worker_id: workerId }).eq('id', reportId);
        if (updateError) {
          throw new Error(`Supabase report status update failed: ${updateError.message}`);
        }
        const { error: insertError } = await supabase.from('worker_tasks').insert({
          id: newTask.id,
          report_id: newTask.reportId, // snake_case
          assigned_worker_id: workerId,
          title: newTask.title,
          description: newTask.description,
          location: newTask.location,
          lat: newTask.lat,
          lng: newTask.lng,
          priority: newTask.priority,
          status: newTask.status,
          type: newTask.type
        });
        if (insertError) {
          throw new Error(`Supabase worker task insert failed: ${insertError.message}`);
        }
      } catch (error) {
        console.error("Error during dispatchReport transaction:", error);
        throw error;
      }

      return newTask;
    } else {
      const reports = await this.getCivicReports();
      const report = reports.find(r => r.id === reportId);
      if (report) {
        report.status = 'dispatched';
        report.assignedWorkerId = workerId;
      }

      const newTask: WorkerTask = {
        id: `task-${Date.now()}`,
        reportId: reportId,
        title: `Dispatch: ${report?.title || 'Reported Incident'}`,
        description: `Reported by ${report?.citizenName || 'Citizen'}: ${report?.description || ''}`,
        location: report?.location || 'Municipal Location',
        lat: report?.lat || 37.7749,
        lng: report?.lng || -122.4194,
        priority,
        status: 'pending',
        type: report?.category === 'hazardous' ? 'hazardous-spill' : 'illegal-dumping'
      };
      saveLocal('reports', reports);
      const tasks = loadLocal('tasks', DEFAULT_TASKS);
      tasks.unshift(newTask);
      saveLocal('tasks', tasks);
      return newTask;
    }
  },

  async dismissReport(reportId: string): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) {
        throw new Error(`Supabase report delete failed: ${error.message}`);
      }
    } else {
      const reports = loadLocal('reports', DEFAULT_REPORTS).filter(r => r.id !== reportId);
      saveLocal('reports', reports);
    }
  },

  // --- WORKER TASKS ---
  async getWorkerTasks(): Promise<WorkerTask[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase
        .from('worker_tasks')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        console.warn('Supabase worker tasks query failed:', error.message);
        if (error.message.includes('Could not find') || error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          (window as any).supabaseSchemaMissing = true;
        }
        throw new Error(`Supabase worker tasks query failed: ${error.message}`);
      }
      if (!data) {
        throw new Error('Supabase worker tasks query returned no data');
      }
      return (data as any[]).map(t => ({ ...t, binId: t.bin_id, reportId: t.report_id, assignedWorkerId: t.assigned_worker_id }));
    } 
    return loadLocal('tasks', DEFAULT_TASKS);
  },

  async completeTask(taskId: string): Promise<{ task: WorkerTask; binId?: string; reportId?: string }> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      // 1. Fetch the specific task to get its details
      const { data: task, error: fetchError } = await supabase
        .from('worker_tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (fetchError || !task) {
        throw new Error(`Failed to fetch task with ID ${taskId}: ${fetchError?.message || 'Not found'}`);
      }

      try {
        const { error: taskError } = await supabase.from('worker_tasks').update({ status: 'completed' }).eq('id', taskId);
        if (taskError) {
          throw new Error(`Supabase completeTask update failed: ${taskError.message}`);
        }
        
        if (task?.bin_id) {
          const { error: binError } = await supabase.from('smart_bins').update({
            fill_level: 0,
            last_emptied: new Date().toISOString().replace('T', ' ').substring(0, 16),
            fire_alert: false,
            sensor_health: 'healthy',
            maintenance_status: 'none'
          }).eq('id', task.bin_id);
          if (binError) {
            throw new Error(`Supabase completeTask bin update failed: ${binError.message}`);
          }
        }

        if (task?.report_id) {
          const { error: reportError } = await supabase.from('reports').update({ status: 'completed' }).eq('id', task.report_id);
          if (reportError) {
            throw new Error(`Supabase completeTask report update failed: ${reportError.message}`);
          }
        }
      } catch (error) {
        console.error("Error during completeTask transaction:", error);
        throw error;
      }

      const completedTask: WorkerTask = {
        ...(task as any),
        binId: task.bin_id,
        reportId: task.report_id,
        assignedWorkerId: task.assigned_worker_id,
      };

      return {
        task: completedTask,
        binId: task.bin_id,
        reportId: task.report_id
      };
    } else {
      const tasks = await this.getWorkerTasks();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'completed';
      }
      saveLocal('tasks', tasks);

      if (task?.binId) {
        const bins = loadLocal('bins', DEFAULT_BINS);
        const bin = bins.find(b => b.id === task.binId);
        if (bin) {
          bin.fillLevel = 0;
          bin.lastEmptied = new Date().toISOString().replace('T', ' ').substring(0, 16);
          bin.fireAlert = false;
          bin.sensorHealth = 'healthy';
          bin.maintenanceStatus = 'none';
        }
        saveLocal('bins', bins);
      }

      if (task?.reportId) {
        const reports = loadLocal('reports', DEFAULT_REPORTS);
        const report = reports.find(r => r.id === task.reportId);
        if (report) {
          report.status = 'completed';
        }
        saveLocal('reports', reports);
      }
      return {
        task: task!,
        binId: task?.binId,
        reportId: task?.reportId
      };
    }
  },

  // --- VEHICLES ---
  async getVehicles(): Promise<any[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (error) {
        console.warn('Supabase vehicles query failed:', error.message);
        if (error.message.includes('Could not find') || error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          (window as any).supabaseSchemaMissing = true;
        }
        throw new Error(`Supabase vehicles query failed: ${error.message}`);
      }
      if (!data) {
        throw new Error('Supabase vehicles query returned no data');
      }
      return (data as any[]).map(v => ({ ...v, battery_level: v.battery_level }));
    } 
    return loadLocal('vehicles', DEFAULT_VEHICLES);
  },

  async updateVehicle(id: string, lat: number, lng: number, batteryLevel: number, status: string): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { error } = await supabase.from('vehicles').update({ lat, lng, battery_level: batteryLevel, status }).eq('id', id);
      if (error) {
        throw new Error(`Supabase updateVehicle failed: ${error.message}`);
      }
    } else {
      const vehicles = loadLocal('vehicles', DEFAULT_VEHICLES);
      const vehicle = vehicles.find(v => v.id === id);
      if (vehicle) {
        vehicle.lat = lat;
        vehicle.lng = lng;
        vehicle.battery_level = batteryLevel;
        vehicle.status = status;
      }
      saveLocal('vehicles', vehicles);
    }
  },

  // --- DEMO SEEDER ---
  async loadDemoMode(): Promise<any> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      // Direct Supabase Seeding
      const { error: d1 } = await supabase.from('smart_bins').delete().neq('id', 'null');
      if (d1) throw new Error(`Demo Mode clear smart_bins failed: ${d1.message}`);

      const { error: d2 } = await supabase.from('reports').delete().neq('id', 'null');
      if (d2) throw new Error(`Demo Mode clear reports failed: ${d2.message}`);

      const { error: d3 } = await supabase.from('worker_tasks').delete().neq('id', 'null');
      if (d3) throw new Error(`Demo Mode clear worker_tasks failed: ${d3.message}`);

      const { error: d4 } = await supabase.from('vehicles').delete().neq('id', 'null');
      if (d4) throw new Error(`Demo Mode clear vehicles failed: ${d4.message}`);

      const binInserts = DEFAULT_BINS.map(b => ({
        id: b.id,
        name: b.name,
        address: b.address,
        category: b.category,
        fill_level: b.fillLevel, // snake_case
        temperature: b.temperature,
        battery_level: b.batteryLevel, // snake_case
        lat: b.lat,
        lng: b.lng,
        last_emptied: b.lastEmptied, // snake_case
        signal_strength: b.signalStrength, // snake_case
        sensor_health: b.sensorHealth, // snake_case
        fire_alert: b.fireAlert, // snake_case
        maintenance_status: b.maintenanceStatus // snake_case
      }));

      const reportInserts = DEFAULT_REPORTS.map(r => ({
        id: r.id,
        citizen_name: r.citizenName,
        title: r.title,
        description: r.description,
        category: r.category,
        location: r.location,
        lat: r.lat,
        lng: r.lng,
        status: r.status,
        green_points: r.greenPoints,
        created_at: r.createdAt
      }));

      const taskInserts = DEFAULT_TASKS.map(t => ({
        id: t.id,
        bin_id: t.binId,
        report_id: t.reportId,
        title: t.title,
        description: t.description,
        location: t.location,
        lat: t.lat,
        lng: t.lng,
        priority: t.priority,
        status: t.status,
        type: t.type
      }));

      const vehicleInserts = DEFAULT_VEHICLES.map(v => ({
        id: v.id,
        name: v.name,
        model: v.model,
        type: v.type,
        battery_level: v.battery_level,
        lat: v.lat,
        lng: v.lng,
        status: v.status
      }));

      const { error: i1 } = await supabase.from('smart_bins').insert(binInserts);
      if (i1) throw new Error(`Demo Mode insert smart_bins failed: ${i1.message}`);

      const { error: i2 } = await supabase.from('reports').insert(reportInserts);
      if (i2) throw new Error(`Demo Mode insert reports failed: ${i2.message}`);

      const { error: i3 } = await supabase.from('worker_tasks').insert(taskInserts);
      if (i3) throw new Error(`Demo Mode insert worker_tasks failed: ${i3.message}`);

      const { error: i4 } = await supabase.from('vehicles').insert(vehicleInserts);
      if (i4) throw new Error(`Demo Mode insert vehicles failed: ${i4.message}`);

      return { success: true };
    } else {
      // In offline mode, just reset local storage to the defaults
      saveLocal('bins', DEFAULT_BINS);
      saveLocal('reports', DEFAULT_REPORTS);
      saveLocal('tasks', DEFAULT_TASKS);
      saveLocal('vehicles', DEFAULT_VEHICLES);
      return { success: true };
    }
  },

  // --- AI CLASSIFICATION ---
  async classifyWaste(imageBase64: string | null, samplePreset: string | null): Promise<WasteAnalysisResponse> {
    if (isSupabaseActive() && getSupabase()) {
      if (!imageBase64) {
        throw new Error('Supabase active: Either an image or a sample preset is required for classification.');
      }
      const supabase = getSupabase()!;
      const { data, error } = await supabase.functions.invoke('waste-classification', {
        body: { imageBase64, presetId: samplePreset }
      });
      if (error) {
        throw new Error(`Edge Function 'waste-classification' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'waste-classification' returned no data`);
      }
      return data;
    }
    // Offline fallback
    if (samplePreset && PRESET_ANALYSES[samplePreset]) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return PRESET_ANALYSES[samplePreset];
    }
    // Return a default mock response if no preset is given
    await new Promise(resolve => setTimeout(resolve, 1500));
    return PRESET_ANALYSES['plastic_bottle'];
  },

  // --- AI PREDICTIONS ---
  async getAIPredictions(): Promise<any> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase.functions.invoke('predictive-forecasting');
      if (error) {
        throw new Error(`Edge Function 'predictive-forecasting' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'predictive-forecasting' returned empty response`);
      }
      return data;
    }
    // Offline fallback with mock data
    return {
      overflowForecast: [
        { binId: 'bin-102', binName: 'Smart Bin SB-102', probability: 92, estimatedTimeHours: 4, reason: 'High retail zone foot traffic' },
        { binId: 'bin-107', binName: 'Smart Bin SB-107', probability: 84, estimatedTimeHours: 9, reason: 'Fisherman Wharf weekend influx' },
        { binId: 'bin-103', binName: 'Smart Bin SB-103', probability: 48, estimatedTimeHours: 18, reason: 'Organic waste decay speed' }
      ],
      failureForecast: [
        { binId: 'bin-103', binName: 'Smart Bin SB-103', failureType: 'Battery Depletion', riskScore: 98, actionRequired: 'Replace lithium battery core' },
        { binId: 'bin-106', binName: 'Smart Bin SB-106', failureType: 'Lid Optical Sensor Obstruction', riskScore: 65, actionRequired: 'Sanitize sensor lens' }
      ],
      landfillDiversionRatePrediction: {
        currentRate: 64.5,
        predictedNextMonth: 68.2,
        gainExplanation: 'AI camera-assisted sorting has significantly improved citizen recycling fidelity.'
      }
    };
  },

  // --- AI ROUTE OPTIMIZATION ---
  async getAIOptimizedRoute(workerTasks: WorkerTask[]): Promise<any> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase.functions.invoke('route-optimization', {
        body: { tasks: workerTasks.filter(t => t.status === 'pending') }
      });
      if (error) {
        throw new Error(`Edge Function 'route-optimization' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'route-optimization' returned empty response`);
      }
      return data;
    }
    // Offline fallback with mock data
    return {
      optimizedSequence: [
        { stopIndex: 1, name: 'Central Park SB-104', lat: 37.7841, lng: -122.4045, type: 'smart-bin', payloadKg: 45 },
        { stopIndex: 2, name: 'Market St Transit SB-102', lat: 37.7812, lng: -122.4115, type: 'smart-bin', payloadKg: 78 },
        { stopIndex: 3, name: 'Fisherman Wharf SB-107', lat: 37.8080, lng: -122.4150, type: 'smart-bin', payloadKg: 62 }
      ],
      evTelemetry: {
        initialChargePct: 92,
        finalChargePct: 84,
        energyConsumedKwh: 12.4,
        co2SavedKg: 28.5,
        trafficStatus: 'Moderate',
        efficiencyScorePct: 95
      },
      routingHeuristics: 'Solved multi-stop TSP path avoiding high-density traffic congestion on US-101.'
    };
  },

  // --- SUSTAINABILITY & ESG DATA ---
  async getESGData(): Promise<any> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase.functions.invoke('sustainability-esg');
      if (error) {
        throw new Error(`Edge Function 'sustainability-esg' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'sustainability-esg' returned empty response`);
      }
      return data;
    }
    // Offline fallback with mock data
    return {
      kpis: {
        scope1EmissionsKg: 1250,
        scope2EmissionsKg: 420,
        carbonSavedKg: 852.5,
        treeEquivalents: 41,
        communityGreenScore: 88,
        esgRating: 'AA+'
      },
      weeklyReductions: [
        { week: 'W1', target: 120, actual: 145 },
        { week: 'W2', target: 130, actual: 155 },
        { week: 'W3', target: 140, actual: 168 },
        { week: 'W4', target: 150, actual: 185 }
      ]
    };
  },

  // --- WORKER PRODUCTIVITY & FLEET DATA ---
  async getWorkerProductivity(): Promise<any> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const { data, error } = await supabase.functions.invoke('worker-productivity');
      if (error) {
        throw new Error(`Edge Function 'worker-productivity' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'worker-productivity' returned empty response`);
      }
      return data;
    }
    throw new Error('Cannot get worker productivity data without active Supabase connection.');
  },

  // --- AI CHATBOT ---
  async streamAIBotResponse(messages: any[]): Promise<ReadableStream<Uint8Array> | null> {
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
      // The 'invoke' method with 'stream' responseType is not standard.
      // A direct fetch to the function URL is the correct way to handle streams.
      const edgeFunctionUrl = `${(window as any).VITE_SUPABASE_URL}/functions/v1/groq-chat`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        throw new Error(`Edge Function 'groq-chat' request failed: ${response.statusText}`);
      }
      return response.body;
    }
    throw new Error('Cannot get AI chat response without active Supabase connection.');
  },

  // --- EMAIL SERVICE ---
  async sendContactEmail(from: string, subject: string, message: string): Promise<void> {
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'support@ecotrack.ai', // Your designated support email
          from: from,
          subject: `EcoTrack Contact Form: ${subject}`,
          html: `<p>New message from <strong>${from}</strong>:</p><blockquote>${message}</blockquote>`
        }
      });
      if (error) throw new Error(`Edge Function 'send-email' failed: ${error.message}`);
    } else throw new Error('Cannot send email without active Supabase connection.');
  },

  async saveScan(scan: Partial<AIWasteScan>, userId: string): Promise<AIWasteScan> {
    const newScan: AIWasteScan = {
      id: scan.id || `scan-${Date.now()}`,
      itemName: scan.itemName || 'Unknown Item',
      category: scan.category || 'landfill',
      confidence: scan.confidence || 0.9,
      recyclable: scan.recyclable ?? false,
      greenPoints: scan.greenPoints || 5,
      binType: scan.binType || 'General Landfill Waste Bin',
      disposalInstructions: scan.disposalInstructions || 'Dispose in regular landfill trash receptacle.',
      materialsDetected: scan.materialsDetected || ['Unknown Material'],
      co2SavedKg: scan.co2SavedKg || 0,
      userId: userId,
      imageUrl: scan.imageUrl || '',
      createdAt: scan.createdAt || new Date().toISOString()
    };

    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      try {
        const { error } = await supabase.from('user_scans').insert({
          id: newScan.id,
          user_id: newScan.userId,
          item_name: newScan.itemName,
          category: newScan.category,
          confidence: newScan.confidence,
          recyclable: newScan.recyclable,
          green_points: newScan.greenPoints,
          bin_type: newScan.binType,
          disposal_instructions: newScan.disposalInstructions,
          materials_detected: newScan.materialsDetected,
          co2_saved_kg: newScan.co2SavedKg,
          image_url: newScan.imageUrl,
          created_at: newScan.createdAt
        });
        if (error) throw new Error(`Supabase save scan error: ${error.message}`);
      } catch (err) {
        console.error('Supabase exception during save scan:', err);
        throw err;
      }
    }
    return newScan;
  },

  async getScans(userId?: string): Promise<AIWasteScan[]> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      try {
        let query = supabase
          .from('user_scans')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;

        if (error) {
          console.error('Supabase fetch scans error (using local):', error);
          throw new Error(`Supabase fetch scans error: ${error.message}`);
        } 
        if (data) {
          const mapped: AIWasteScan[] = data.map(s => ({
            id: s.id,
            userId: s.user_id,
            itemName: s.item_name,
            category: s.category as WasteCategory,
            confidence: s.confidence,
            recyclable: s.recyclable,
            greenPoints: s.green_points,
            binType: s.bin_type,
            disposalInstructions: s.disposal_instructions,
            materialsDetected: s.materials_detected,
            co2SavedKg: s.co2_saved_kg,
            imageUrl: s.image_url,
            createdAt: s.created_at
          }));
          return mapped;
        }
      } catch (err) {
        console.error('Supabase exception get scans:', err);
        throw err;
      }
    }
    return [];
  },

  async triggerTelemetryAlert(id: string, telemetry: any): Promise<void> {
    const supabase = getSupabase();
    if (isSupabaseActive() && supabase) {
      const updates: any = {};
      if (telemetry.smokeLevel !== undefined) {
        updates.fire_alert = telemetry.smokeLevel > 50;
        updates.temperature = 82;
      }
      if (telemetry.tilt !== undefined) {
        updates.sensor_health = 'degraded';
      }
      if (telemetry.battery !== undefined) {
        updates.battery_level = telemetry.battery;
      }
      if (telemetry.status === 'online') {
        updates.fire_alert = false;
        updates.sensor_health = 'healthy';
        updates.battery_level = 95;
      }
      const { error } = await supabase.from('smart_bins').update(updates).eq('id', id);
      if (error) {
        throw new Error(`Supabase telemetry alert update failed: ${error.message}`);
      }
    }
  }
};
