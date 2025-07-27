export interface Event {
  id?: number
  title: string
  startDate: string
  endDate: string
  price: number
  status: 'STARTED' | 'COMPLETED' | 'PAUSED'
}