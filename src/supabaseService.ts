import { getSupabase, isSupabaseActive } from './supabaseClient';
import { SmartBin, CivicReport, WorkerTask, UserProfile, WasteAnalysisResponse, WasteCategory, AIWasteScan } from './types';

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

const DEFAULT_VEHICLES = [
  { id: 'v-14', name: 'EV-TRUCK-14', model: 'MACK LR Electric', type: 'EV-Truck', batteryLevel: 92, lat: 37.7780, lng: -122.4120, status: 'Available' },
  { id: 'v-11', name: 'EV-TRUCK-11', model: 'BYD 8R Heavy Duty', type: 'Heavy-Duty', batteryLevel: 78, lat: 37.7830, lng: -122.4090, status: 'Collecting' }
];

// LocalStorage helpers to simulate database persistence in offline mode
const loadLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(`ecotrack_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const saveLocal = <T>(key: string, value: T): void => {
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
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        throw new Error(`Supabase profile query failed: ${error.message}`);
      }
      if (data) {
        return {
          email: data.email || '',
          role: data.role as any || 'citizen',
          name: data.name || '',
          points: data.points || 0,
          avatarUrl: data.avatar_url || ''
        };
      }
      return null;
    }
    return null;
  },

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
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
    }
  },

  // --- SMART BINS ---
  async getSmartBins(): Promise<SmartBin[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('smart_bins')
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
      return data.map(b => ({
        id: b.id,
        name: b.name,
        address: b.address,
        category: b.category as WasteCategory,
        fillLevel: parseFloat(b.fill_level),
        temperature: parseFloat(b.temperature),
        batteryLevel: b.battery_level,
        lat: parseFloat(b.lat),
        lng: parseFloat(b.lng),
        lastEmptied: b.last_emptied,
        signalStrength: b.signal_strength,
        sensorHealth: b.sensor_health,
        fireAlert: b.fire_alert,
        maintenanceStatus: b.maintenance_status
      }));
    }
    return loadLocal('bins', DEFAULT_BINS);
  },

  async addBin(bin: Partial<SmartBin>): Promise<SmartBin> {
    const id = `bin-${Math.floor(100 + Math.random() * 900)}`;
    const newBin: SmartBin = {
      id,
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
    if (supabase) {
      const { error } = await supabase.from('smart_bins').insert({
        id: newBin.id,
        name: newBin.name,
        address: newBin.address,
        category: newBin.category,
        fill_level: newBin.fillLevel,
        temperature: newBin.temperature,
        battery_level: newBin.batteryLevel,
        lat: newBin.lat,
        lng: newBin.lng,
        last_emptied: newBin.lastEmptied,
        signal_strength: newBin.signalStrength,
        sensor_health: newBin.sensorHealth,
        fire_alert: newBin.fireAlert,
        maintenance_status: newBin.maintenanceStatus
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
    if (supabase) {
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
    if (supabase) {
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
      return data.map(r => ({
        id: r.id,
        citizenName: r.citizen_name,
        title: r.title,
        description: r.description,
        category: r.category as WasteCategory,
        location: r.location,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lng),
        status: r.status,
        imageUrl: r.image_url,
        greenPoints: r.green_points,
        assignedWorkerId: r.assigned_worker_id,
        createdAt: r.created_at
      }));
    }
    return loadLocal('reports', DEFAULT_REPORTS);
  },

  async addReport(report: Partial<CivicReport>): Promise<CivicReport> {
    const newReport: CivicReport = {
      id: `rep-${Math.floor(100 + Math.random() * 900)}`,
      citizenName: report.citizenName || 'Anonymous Citizen',
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
    if (supabase) {
      const { error } = await supabase.from('reports').insert({
        id: newReport.id,
        citizen_name: newReport.citizenName,
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        location: newReport.location,
        lat: newReport.lat,
        lng: newReport.lng,
        status: newReport.status,
        image_url: newReport.imageUrl,
        green_points: newReport.greenPoints,
        created_at: newReport.createdAt
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

    const supabase = getSupabase();
    if (supabase) {
      const { error: updateError } = await supabase.from('reports').update({ status: 'dispatched', assigned_worker_id: workerId }).eq('id', reportId);
      if (updateError) {
        throw new Error(`Supabase report status update failed: ${updateError.message}`);
      }
      const { error: insertError } = await supabase.from('worker_tasks').insert({
        id: newTask.id,
        report_id: newTask.reportId,
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
    } else {
      saveLocal('reports', reports);
      const tasks = loadLocal('tasks', DEFAULT_TASKS);
      tasks.unshift(newTask);
      saveLocal('tasks', tasks);
    }

    return newTask;
  },

  async dismissReport(reportId: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
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
    if (supabase) {
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
      return data.map(t => ({
        id: t.id,
        binId: t.bin_id,
        reportId: t.report_id,
        title: t.title,
        description: t.description,
        location: t.location,
        lat: parseFloat(t.lat),
        lng: parseFloat(t.lng),
        priority: t.priority,
        status: t.status,
        type: t.type
      }));
    }
    return loadLocal('tasks', DEFAULT_TASKS);
  },

  async completeTask(taskId: string): Promise<{ task: WorkerTask; binId?: string; reportId?: string }> {
    const tasks = await this.getWorkerTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error: taskError } = await supabase.from('worker_tasks').update({ status: 'completed' }).eq('id', taskId);
      if (taskError) {
        throw new Error(`Supabase completeTask update failed: ${taskError.message}`);
      }
      
      if (task?.binId) {
        const { error: binError } = await supabase.from('smart_bins').update({
          fill_level: 0,
          last_emptied: new Date().toISOString().replace('T', ' ').substring(0, 16),
          fire_alert: false,
          sensor_health: 'healthy',
          maintenance_status: 'none'
        }).eq('id', task.binId);
        if (binError) {
          throw new Error(`Supabase completeTask bin update failed: ${binError.message}`);
        }
      }

      if (task?.reportId) {
        const { error: reportError } = await supabase.from('reports').update({ status: 'completed' }).eq('id', task.reportId);
        if (reportError) {
          throw new Error(`Supabase completeTask report update failed: ${reportError.message}`);
        }
      }
    } else {
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
    }

    return {
      task: task || { id: taskId, title: '', description: '', location: '', lat: 37, lng: -122, priority: 'medium', status: 'completed', type: 'bin-collection' },
      binId: task?.binId,
      reportId: task?.reportId
    };
  },

  // --- VEHICLES ---
  async getVehicles(): Promise<any[]> {
    const supabase = getSupabase();
    if (supabase) {
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
      return data.map(v => ({
        id: v.id,
        name: v.name,
        model: v.model,
        type: v.type,
        batteryLevel: parseFloat(v.battery_level),
        lat: parseFloat(v.lat),
        lng: parseFloat(v.lng),
        status: v.status
      }));
    }
    return loadLocal('vehicles', DEFAULT_VEHICLES);
  },

  async updateVehicle(id: string, lat: number, lng: number, batteryLevel: number, status: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
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
        vehicle.batteryLevel = batteryLevel;
        vehicle.status = status as any;
      }
      saveLocal('vehicles', vehicles);
    }
  },

  // --- DEMO SEED SEEDER ---
  async loadDemoMode(): Promise<any> {
    const supabase = getSupabase();
    if (supabase) {
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
        fill_level: b.fillLevel,
        temperature: b.temperature,
        battery_level: b.batteryLevel,
        lat: b.lat,
        lng: b.lng,
        last_emptied: b.lastEmptied,
        signal_strength: b.signalStrength,
        sensor_health: b.sensorHealth,
        fire_alert: b.fireAlert,
        maintenance_status: b.maintenanceStatus
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
        battery_level: v.batteryLevel,
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
      localStorage.removeItem('ecotrack_bins');
      localStorage.removeItem('ecotrack_reports');
      localStorage.removeItem('ecotrack_tasks');
      localStorage.removeItem('ecotrack_vehicles');
      return { success: true };
    }
  },

  // --- AI CLASSIFICATION ---
  async classifyWaste(imageBase64: string | null, samplePreset: string | null): Promise<WasteAnalysisResponse> {
    if (isSupabaseActive()) {
      if (!imageBase64) {
        throw new Error('Supabase active: Base64 image payload is required for Edge classification.');
      }
      const supabase = getSupabase()!;
      const { data, error } = await supabase.functions.invoke('waste-classification', {
        body: { imageBase64 }
      });
      if (error) {
        throw new Error(`Edge Function 'waste-classification' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'waste-classification' returned no data`);
      }
      return data;
    }

    if (samplePreset && PRESET_ANALYSES[samplePreset]) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return PRESET_ANALYSES[samplePreset];
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    return PRESET_ANALYSES['plastic_bottle'];
  },

  // --- AI PREDICTIONS ---
  async getAIPredictions(): Promise<any> {
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
      const { data, error } = await supabase.functions.invoke('predictive-forecasting');
      if (error) {
        throw new Error(`Edge Function 'predictive-forecasting' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'predictive-forecasting' returned empty response`);
      }
      return data;
    }

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
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
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
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
      const { data, error } = await supabase.functions.invoke('sustainability-esg');
      if (error) {
        throw new Error(`Edge Function 'sustainability-esg' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'sustainability-esg' returned empty response`);
      }
      return data;
    }

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
    if (isSupabaseActive()) {
      const supabase = getSupabase()!;
      const { data, error } = await supabase.functions.invoke('worker-productivity');
      if (error) {
        throw new Error(`Edge Function 'worker-productivity' failed: ${error.message}`);
      }
      if (!data) {
        throw new Error(`Edge Function 'worker-productivity' returned empty response`);
      }
      return data;
    }

    return {
      avgResolutionTimeMinutes: 24.5,
      collectionCompletionRatePct: 98.4,
      idleAlertsCount: 1,
      fuelEfficiencyScorePct: 96,
      workersList: [
        { workerId: 'worker-1', name: 'Marcus Vance', activeVehicles: 'EV-TRUCK-14', tasksCompleted: 42, idleAlerts: 0, fuelScore: 98 },
        { workerId: 'worker-2', name: 'Sarah Jenkins', activeVehicles: 'EV-TRUCK-11', tasksCompleted: 38, idleAlerts: 1, fuelScore: 94 },
        { workerId: 'worker-3', name: 'Dave Miller', activeVehicles: 'Crew Truck 4', tasksCompleted: 29, idleAlerts: 0, fuelScore: 95 }
      ]
    };
  },

  async createSmartBin(bin: Partial<SmartBin>): Promise<any> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('smart_bins').insert({
        id: bin.id || `bin-${Date.now()}`,
        name: bin.name,
        address: bin.address || 'District IoT Mapped Segment',
        category: bin.category || 'recyclable',
        fill_level: 0,
        temperature: 20,
        battery_level: 100,
        lat: 37.7749 + (Math.random() - 0.5) * 0.02,
        lng: -122.4194 + (Math.random() - 0.5) * 0.02,
        signal_strength: 'Excellent',
        sensor_health: 'healthy',
        fire_alert: false,
        maintenance_status: 'none'
      }).select();
      if (error) throw error;
      return data?.[0];
    } else {
      const bins = loadLocal('smart_bins', DEFAULT_BINS);
      const newBin: SmartBin = {
        id: bin.id || `bin-${Date.now()}`,
        name: bin.name || 'New Smart Bin',
        address: bin.address || 'District IoT Mapped Segment',
        category: (bin.category || 'recyclable') as any,
        fillLevel: 0,
        temperature: 20,
        batteryLevel: 100,
        lat: 37.7749 + (Math.random() - 0.5) * 0.02,
        lng: -122.4194 + (Math.random() - 0.5) * 0.02,
        lastEmptied: new Date().toISOString().substring(0, 16).replace('T', ' '),
        signalStrength: 'Excellent',
        sensorHealth: 'healthy',
        fireAlert: false,
        maintenanceStatus: 'none'
      };
      bins.push(newBin);
      saveLocal('smart_bins', bins);
      return newBin;
    }
  },

  async saveScan(scan: Partial<AIWasteScan>): Promise<AIWasteScan> {
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
      imageUrl: scan.imageUrl || '',
      createdAt: scan.createdAt || new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('user_scans').insert({
          id: newScan.id,
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
        if (error) console.error('Supabase save scan error (falling back to local):', error);
      } catch (err) {
        console.error('Supabase exception save scan:', err);
      }
    }

    // Hybrid offline-first local persistence
    const scans = loadLocal<AIWasteScan[]>('user_scans', []);
    scans.unshift(newScan);
    saveLocal('user_scans', scans);
    return newScan;
  },

  async getScans(): Promise<AIWasteScan[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_scans')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase fetch scans error (using local):', error);
        } else if (data) {
          const mapped: AIWasteScan[] = data.map(s => ({
            id: s.id,
            itemName: s.item_name,
            category: s.category as any,
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
          saveLocal('user_scans', mapped);
          return mapped;
        }
      } catch (err) {
        console.error('Supabase exception get scans:', err);
      }
    }

    // Default seeded local scans to make it feel rich out-of-the-box
    const defaultScans: AIWasteScan[] = [
      {
        id: 'scan-1',
        itemName: 'PET Plastic Water Bottle',
        category: 'recyclable',
        confidence: 0.98,
        recyclable: true,
        greenPoints: 15,
        binType: 'Blue Recycling Bin (Plastics & Cans)',
        disposalInstructions: 'Rinse out any remaining liquid, compress the bottle to save volume.',
        materialsDetected: ['Polyethylene Terephthalate (PET 1)'],
        co2SavedKg: 0.12,
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString() // 2 days ago
      },
      {
        id: 'scan-2',
        itemName: 'AA Alkaline Battery',
        category: 'hazardous',
        confidence: 0.96,
        recyclable: false,
        greenPoints: 40,
        binType: 'Red Hazard / E-Waste Depot Bin',
        disposalInstructions: 'Do NOT throw in municipal trash. Recycle at designated battery drop-off hubs.',
        materialsDetected: ['Manganese Dioxide', 'Zinc', 'Steel'],
        co2SavedKg: 0.45,
        createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString() // 4 days ago
      },
      {
        id: 'scan-3',
        itemName: 'Banana Peel Scraps',
        category: 'organic',
        confidence: 0.95,
        recyclable: false,
        greenPoints: 10,
        binType: 'Green Organics / Compost Bin',
        disposalInstructions: 'Deposit directly into green compost bin without any plastic bags.',
        materialsDetected: ['Organic Matter'],
        co2SavedKg: 0.08,
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString() // 5 days ago
      }
    ];

    return loadLocal<AIWasteScan[]>('user_scans', defaultScans);
  },

  async triggerTelemetryAlert(id: string, telemetry: any): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
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
    } else {
      const bins = loadLocal('smart_bins', DEFAULT_BINS);
      const bin = bins.find(b => b.id === id);
      if (bin) {
        if (telemetry.smokeLevel !== undefined) {
          bin.fireAlert = telemetry.smokeLevel > 50;
          bin.temperature = 82;
        }
        if (telemetry.tilt !== undefined) {
          bin.sensorHealth = 'degraded';
        }
        if (telemetry.battery !== undefined) {
          bin.batteryLevel = telemetry.battery;
        }
        if (telemetry.status === 'online') {
          bin.fireAlert = false;
          bin.sensorHealth = 'healthy';
          bin.batteryLevel = 95;
        }
        saveLocal('smart_bins', bins);
      }
    }
  }
};
