import { useEffect, useState } from 'react'
import type { Event } from '../interfaces/Event'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/events'

const initialEvent: Event = {
  title: '',
  startDate: '',
  endDate: '',
  price: 0,
  status: 'STARTED',
}

export function useEvents() {
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
    getEvents()
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar eventos')
        setLoading(false)
      })
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const action = editingId
      ? updateEvent(editingId, form)
      : createEvent(form)

    action
      .then(() => {
        setForm(initialEvent)
        setEditingId(null)
        setSuccess(editingId ? 'Evento atualizado!' : 'Evento criado!')
        fetchEvents()
        setLoading(false)
      })
      .catch(() => {
        setError(editingId ? 'Erro ao atualizar evento' : 'Erro ao criar evento')
        setLoading(false)
      })
  }

  function handleEdit(event: Event) {
    setEditingId(event.id!)
    setForm({
      ...event,
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
    })
  }

  function handleDelete(id: number) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    deleteEvent(id)
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

  return {
    events,
    form,
    editingId,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
  }
}
