interface StatusTagProps {
  status: 'STARTED' | 'COMPLETED' | 'PAUSED'
}

export default function StatusTag({ status }: StatusTagProps) {
  const className =
    status === 'STARTED'
      ? 'status started'
      : status === 'COMPLETED'
      ? 'status completed'
      : 'status paused'

  const label =
    status === 'STARTED'
      ? 'Iniciado'
      : status === 'COMPLETED'
      ? 'Finalizado'
      : 'Pausado'

  return <span className={className}>{label}</span>
}
