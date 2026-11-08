const path = require('path');
const { readJsonFile, writeJsonFile, readJsonBody } = require('../utils/helpers');

const MAINTENANCE_FILE = path.join(__dirname, '../data', 'maintenance_records.json');
const VEHICLES_FILE = path.join(__dirname, '../data', 'vehicles.json');

async function createMaintenanceRecord(req, res) {
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const { vehicle_id, description, start_date, end_date, status } = body;

  const vehicles = await readJsonFile(VEHICLES_FILE);
  const vehicle = vehicles.find((v) => v.vehicle_id === Number(vehicle_id));
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const records = await readJsonFile(MAINTENANCE_FILE);
  const newId = records.length > 0 ? Math.max(...records.map(r => r.maintenance_id)) + 1 : 1;

  const newRecord = {
    maintenance_id: newId,
    vehicle_id: Number(vehicle_id),
    description,
    start_date,
    end_date: end_date || null,
    status: status || 'scheduled',
    created_at: new Date().toISOString()
  };

  records.push(newRecord);
  await writeJsonFile(MAINTENANCE_FILE, records);
  res.status(201).json(newRecord);
};

async function getVehicleMaintenanceRecords(req, res) {
  const vehicleId = Number(req.params.vehicle_id);
  const records = await readJsonFile(MAINTENANCE_FILE);
  const vehicleRecords = records.filter((r) => r.vehicle_id === vehicleId);
  res.json(vehicleRecords);
};

async function updateMaintenanceStatus(req, res) {
  const id = Number(req.params.id);
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const records = await readJsonFile(MAINTENANCE_FILE);
  const record = records.find((r) => r.maintenance_id === id);
  if (!record) return res.status(404).json({ error: 'Maintenance record not found' });

  if (body.status) record.status = body.status;
  if (body.end_date) record.end_date = body.end_date;

  await writeJsonFile(MAINTENANCE_FILE, records);
  res.json({ message: 'Maintenance record updated successfully', record });
};

module.exports = { createMaintenanceRecord, getVehicleMaintenanceRecords, updateMaintenanceStatus };