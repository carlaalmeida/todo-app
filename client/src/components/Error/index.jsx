import { ErrorIcon } from "react-hot-toast";
import "./index.scss";

export default function Error({ error, onRetry }) {
  const { status, message, code } = error;

  return (
    <section className="error">
      <div className="error__header">
        <ErrorIcon className="error__icon" />
        <h2 className="error__title">There was an error: {message}</h2>
      </div>

      {status && (
        <pre className="error__description">
          {status} - {code}
        </pre>
      )}

      <button className="error__action button-link" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}
