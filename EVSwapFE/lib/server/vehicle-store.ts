export type VehicleRecord = {
  id: number
  vin: string
  vehicleModel: string
  batteryType: string
  registerInformation?: string
  userId?: number | null
  userName?: string
}

const vehicles: VehicleRecord[] = [
  {
    id: 1,
    vin: "VN1-AAA-0001",
    vehicleModel: "VinFast VF8",
    batteryType: "Extended (90kWh)",
    registerInformation: "HCMC",
    userId: 1,
    userName: "minh.pham",
  },
  {
    id: 2,
    vin: "VN1-AAA-0002",
    vehicleModel: "Tesla Model 3",
    batteryType: "Standard (60kWh)",
    registerInformation: "HN",
    userId: 2,
    userName: "an.nguyen",
  },
  {
    id: 3,
    vin: "VN1-AAA-0003",
    vehicleModel: "BMW iX3",
    batteryType: "Premium (120kWh)",
    registerInformation: "Da Nang",
    userId: 3,
    userName: "linh.do",
  },
]

let nextVehicleId = vehicles.length + 1

export function listVehicles() {
  return vehicles
}

export function listVehiclesByUser(userId: number) {
  return vehicles.filter((vehicle) => vehicle.userId === userId)
}

export function getVehicle(id: number) {
  return vehicles.find((vehicle) => vehicle.id === id)
}

export function createVehicle(payload: Omit<VehicleRecord, "id">) {
  const record: VehicleRecord = {
    ...payload,
    id: nextVehicleId++,
  }
  vehicles.push(record)
  return record
}

export function updateVehicle(id: number, updates: Partial<Omit<VehicleRecord, "id">>) {
  const index = vehicles.findIndex((vehicle) => vehicle.id === id)
  if (index === -1) return null

  vehicles[index] = { ...vehicles[index], ...updates }
  return vehicles[index]
}

export function deleteVehicle(id: number) {
  const index = vehicles.findIndex((vehicle) => vehicle.id === id)
  if (index === -1) return false

  vehicles.splice(index, 1)
  return true
}

