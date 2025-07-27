import type { Event } from '../interfaces/Event'
import StatusTag from './StatusTag'

interface EventTableProps {
  events: Event[]
  loading: boolean
  handleEdit: (event: Event) => void
  handleDelete: (id: number) => void
}

export default function EventTable({
  events,
  loading,
  handleEdit,
  handleDelete,
}: EventTableProps) {
  return (
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
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                Nenhum evento cadastrado
              </td>
            </tr>
          )}
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td>{new Date(ev.startDate).toLocaleString()}</td>
              <td>{new Date(ev.endDate).toLocaleString()}</td>
              <td>R$ {Number(ev.price).toFixed(2)}</td>
              <td>
                <StatusTag status={ev.status} />
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(ev)}
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(ev.id!)}
                  disabled={loading}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
