const path = require('path');
const { readJsonFile, writeJsonFile, readJsonBody } = require('../utils/helpers');

const VEHICLES_FILE = path.join(__dirname, '../data', 'vehicles.json');
const VEHICLE_FIELDS = ['category_id', 'make', 'model', 'year', 'license_plate', 'daily_rate', 'transmission', 'fuel_type', 'seats', 'description', 'operational_status'];

async function getVehicles(req, res) {
  const vehicles = await readJsonFile(VEHICLES_FILE);
  res.json(vehicles);
}

async function getVehicleById(req, res) {
  const vehicles = await readJsonFile(VEHICLES_FILE);
  const id = Number(req.params.id);
  const vehicle = vehicles.find((v) => v.vehicle_id === id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
}

async function createVehicle(req, res) {
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const vehicles = await readJsonFile(VEHICLES_FILE);
  const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.vehicle_id)) + 1 : 1;

  const newVehicle = {
    vehicle_id: newId,
    category_id: body.category_id,
    make: body.make,
    model: body.model,
    year: body.year,
    license_plate: body.license_plate,
    daily_rate: body.daily_rate,
    transmission: body.transmission,
    fuel_type: body.fuel_type,
    seats: body.seats,
    description: body.description,
    operational_status: body.operational_status || 'available',
    created_at: new Date().toISOString()
  };

  vehicles.push(newVehicle);
  await writeJsonFile(VEHICLES_FILE, vehicles);
  res.status(201).json(newVehicle);
}

async function updateVehicle(req, res) {
  const id = Number(req.params.id);
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const vehicles = await readJsonFile(VEHICLES_FILE);
  const vehicle = vehicles.find((v) => v.vehicle_id === id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  for (const field of VEHICLE_FIELDS) {
    if (body[field] !== undefined)
      vehicle[field] = body[field];
  }
  vehicle.updated_at = new Date().toISOString();

  await writeJsonFile(VEHICLES_FILE, vehicles);
  res.json(vehicle);
}

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle };