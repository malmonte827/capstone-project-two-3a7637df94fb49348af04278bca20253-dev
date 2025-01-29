import Spinner from 'react-bootstrap/Spinner';
import "./LoadingSpinner.css"

/**LoadingSpinner component
 * 
 * Shows a spinner loader when content is loading
 */


function LoadingSpinner() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default LoadingSpinner;