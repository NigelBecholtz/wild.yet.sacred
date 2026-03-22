export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export interface Availability {
  id: number
  date: string
  startTime: string
  endTime: string
  createdAt: string
}

export interface Booking {
  id: number
  userId: number
  availabilityId: number
  clientName: string
  clientAge: number | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  availability: Availability
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface ContentMap {
  [page: string]: { [key: string]: string }
}

export interface AdminStats {
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  total: number
  today: number
}
