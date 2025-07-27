import type { Event } from '../interfaces/Event'

interface EventFormProps {
  form: Event
  editingId: number | null
  loading: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function EventForm({
  form,
  editingId,
  loading,
  handleChange,
  handleSubmit,
}: EventFormProps) {
  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="startDate"
          type="datetime-local"
          value={form.startDate}
          onChange={handleChange}
          required
        />
        <input
          name="endDate"
          type="datetime-local"
          value={form.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
          placeholder="Preço"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="STARTED">STARTED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="PAUSED">PAUSED</option>
        </select>
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {editingId ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}
