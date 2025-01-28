import LoadingSpinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
  return (
    <LoadingSpinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </LoadingSpinner>
  );
}

export default LoadingSpinner;