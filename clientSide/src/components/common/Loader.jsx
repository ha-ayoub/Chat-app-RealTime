export default function Loader({ message = 'Chargement...' }) {
  return (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-secondary">{message}</p>
    </div>
  );
}