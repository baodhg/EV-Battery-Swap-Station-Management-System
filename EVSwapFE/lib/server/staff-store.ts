export type StaffRole = "manager" | "technician" | "support"

export type StaffMemberRecord = {
  id: number
  name: string
  email: string
  role: StaffRole
  status: "active" | "inactive"
  joinDate: string
  permissions: string[]
}

export type StaffTransactionRecord = {
  id: string
  amount: number
  status: "approved" | "pending" | "failed"
  createdAt: string
  relatedBookingId?: string
  reason?: string
}

export type StaffFeedbackRecord = {
  id: string
  fromStaffId: number
  subject: string
  message: string
  severity: "low" | "medium" | "high"
  createdAt: string
}

const staffMembers: StaffMemberRecord[] = [
  {
    id: 1,
    name: "John Manager",
    email: "john@evswap.com",
    role: "manager",
    status: "active",
    joinDate: "2024-01-15",
    permissions: [
      "View all bookings",
      "Manage staff",
      "View reports",
      "Edit settings",
      "Approve transactions",
      "Access analytics",
    ],
  },
  {
    id: 2,
    name: "Sarah Technician",
    email: "sarah@evswap.com",
    role: "technician",
    status: "active",
    joinDate: "2024-02-20",
    permissions: [
      "View assigned bookings",
      "Update swap status",
      "Report issues",
      "View own performance",
    ],
  },
  {
    id: 3,
    name: "Mike Support",
    email: "mike@evswap.com",
    role: "support",
    status: "active",
    joinDate: "2024-03-10",
    permissions: [
      "View customer info",
      "Handle inquiries",
      "Create support tickets",
      "View FAQ",
    ],
  },
]

const transactions: StaffTransactionRecord[] = [
  { id: "TX-001", amount: 1200000, status: "approved", createdAt: new Date().toISOString() },
  { id: "TX-002", amount: 640000, status: "pending", createdAt: new Date().toISOString() },
  { id: "TX-003", amount: 830000, status: "failed", createdAt: new Date().toISOString() },
]

const feedbacks: StaffFeedbackRecord[] = []

let nextStaffId = staffMembers.length + 1
let nextFeedbackId = 1

export function listStaffMembers() {
  return staffMembers
}

export function updateStaffMember(id: number, updates: Partial<StaffMemberRecord>) {
  const index = staffMembers.findIndex((member) => member.id === id)
  if (index === -1) return null
  staffMembers[index] = { ...staffMembers[index], ...updates }
  return staffMembers[index]
}

export function deleteStaffMember(id: number) {
  const index = staffMembers.findIndex((member) => member.id === id)
  if (index === -1) return false
  staffMembers.splice(index, 1)
  return true
}

export function listTransactions() {
  return transactions
}

export function createTransaction(payload: Pick<StaffTransactionRecord, "relatedBookingId" | "reason">) {
  const record: StaffTransactionRecord = {
    id: `TX-${(transactions.length + 1).toString().padStart(3, "0")}`,
    amount: Math.round(500000 + Math.random() * 700000),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload,
  }
  transactions.unshift(record)
  return record
}

export function recordFeedback(payload: Omit<StaffFeedbackRecord, "id" | "createdAt">) {
  const record: StaffFeedbackRecord = {
    ...payload,
    id: `FB-${String(nextFeedbackId++).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  }
  feedbacks.unshift(record)
  return record
}

export function getSystemHealth() {
  return {
    db: "ok",
    queue: "ok",
    payments: transactions.some((tx) => tx.status === "failed") ? "degraded" : "ok",
    version: "2025.11.1",
  }
}

