import { useEvents } from '../hooks/useEvents'
import EventForm from '../components/EventForm.tsx'
import EventTable from '../components/EventTable'
import '../styles/events.css'

export default function EventsPage() {
  const {
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
  } = useEvents()

  return (
    <div className="event-container">
      <h1>Gerenciador de Eventos</h1>
      <EventForm
        form={form}
        editingId={editingId}
        loading={loading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {error && <div className="msg error">{error}</div>}
      {success && <div className="msg success">{success}</div>}
      {loading && <div className="msg loading">Carregando...</div>}
      <EventTable
        events={events}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  )
}
