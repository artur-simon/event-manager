import { useEffect, useState } from 'react'
import axios from 'axios'

interface Event {
  id?: number
  title: string
  startDate: string
  endDate: string
  price: number
  status: string
}

const initialEvent: Event = {
  title: '',
  startDate: '',
  endDate: '',
  price: 0,
  status: 'STARTED',
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState<Event>(initialEvent)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  function fetchEvents() {
    axios.get<Event[]>('/events').then(res => setEvents(res.data))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      axios.put(`/events/${editingId}`, form).then(() => {
        setEditingId(null)
        setForm(initialEvent)
        fetchEvents()
      })
    } else {
      axios.post('/events', form).then(() => {
        setForm(initialEvent)
        fetchEvents()
      })
    }
  }

  function handleEdit(event: Event) {
    setEditingId(event.id!)
    setForm(event)
  }

  function handleDelete(id: number) {
    axios.delete(`/events/${id}`).then(() => fetchEvents())
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Event Manager</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} required />
        <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} required />
        <input name="price" type="number" value={form.price} onChange={handleChange} required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="STARTED">STARTED</option>
          <option value="ENDED">ENDED</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <ul>
        {Array.isArray(events) && events.map(ev => (
          <li key={ev.id}>
            {ev.title} - {ev.status} - ${ev.price}
            <button onClick={() => handleEdit(ev)}>Edit</button>
            <button onClick={() => handleDelete(ev.id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
