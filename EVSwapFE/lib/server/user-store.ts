export type UserRecord = {
  userID: number
  userName: string
  fullName: string
  email: string
}

const users: UserRecord[] = [
  { userID: 1, userName: "minh.pham", fullName: "Minh Pham", email: "minh.pham@example.com" },
  { userID: 2, userName: "an.nguyen", fullName: "An Nguyen", email: "an.nguyen@example.com" },
  { userID: 3, userName: "linh.do", fullName: "Linh Do", email: "linh.do@example.com" },
  { userID: 4, userName: "quang.le", fullName: "Quang Le", email: "quang.le@example.com" },
]

export function findUserByName(name: string) {
  const normalized = name.trim().toLowerCase()
  return users.find((user) => user.userName.toLowerCase() === normalized)
}

