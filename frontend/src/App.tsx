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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  function fetchEvents() {
    setLoading(true)
    setError(null)
    axios.get<Event[]>('/events')
      .then(res => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar eventos')
        setLoading(false)
      })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    if (editingId) {
      axios.put(`/events/${editingId}`, form)
        .then(() => {
          setEditingId(null)
          setForm(initialEvent)
          setSuccess('Evento atualizado!')
          fetchEvents()
          setLoading(false)
        })
        .catch(() => {
          setError('Erro ao atualizar evento')
          setLoading(false)
        })
    } else {
      axios.post('/events', form)
        .then(() => {
          setForm(initialEvent)
          setSuccess('Evento criado!')
          fetchEvents()
          setLoading(false)
        })
        .catch(() => {
          setError('Erro ao criar evento')
          setLoading(false)
        })
    }
  }

  function handleEdit(event: Event) {
    setEditingId(event.id!)
    setForm({ ...event, startDate: event.startDate.slice(0, 16), endDate: event.endDate.slice(0, 16) })
  }

  function handleDelete(id: number) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    axios.delete(`/events/${id}`)
      .then(() => {
        setSuccess('Evento removido!')
        fetchEvents()
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao remover evento')
        setLoading(false)
      })
  }

  return (
    <div className="event-container">
      <h1>Gerenciador de Eventos</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
          <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} required />
          <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="Preço" />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="STARTED">STARTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="PAUSED">PAUSED</option>
          </select>
          <button type="submit" className="submit-btn" disabled={loading}>{editingId ? 'Atualizar' : 'Criar'}</button>
        </div>
      </form>
      {error && <div className="msg error">{error}</div>}
      {success && <div className="msg success">{success}</div>}
      {loading && <div className="msg loading">Carregando...</div>}
      <div className="event-list-wrapper">
        <table className="event-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && !loading && (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Nenhum evento cadastrado</td></tr>
            )}
            {Array.isArray(events) && events.map(ev => (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td>{new Date(ev.startDate).toLocaleString()}</td>
                <td>{new Date(ev.endDate).toLocaleString()}</td>
                <td>R$ {Number(ev.price).toFixed(2)}</td>
                <td>
                  <span
                    className={
                      ev.status === 'STARTED' ? 'status started' :
                        ev.status === 'COMPLETED' ? 'status completed' :
                          'status paused'
                    }
                  >
                    {ev.status === 'STARTED'
                      ? 'Iniciado'
                      : ev.status === 'COMPLETED'
                        ? 'Finalizado'
                        : 'Pausado'}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(ev)} disabled={loading}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(ev.id!)} disabled={loading}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
