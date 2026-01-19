interface LoadingStateProps {
  message?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando valoraciones...'
}) => {
  return (
    <div className="py-8 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
