import axios from 'axios'
import type { Event } from '../interfaces/Event'

export async function getEvents(): Promise<Event[]> {
  return await axios.get<Event[]>('/events').then(res => res.data)
}

export async function createEvent(event: Event): Promise<void> {
  return await axios.post('/events', event).then(() => {})
}

export async function updateEvent(id: number, event: Event): Promise<void> {
  return await axios.put(`/events/${id}`, event).then(() => {})
}

export async function deleteEvent(id: number): Promise<void> {
  return await axios.delete(`/events/${id}`).then(() => {})
}
