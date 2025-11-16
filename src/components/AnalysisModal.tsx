import { X } from "lucide-react";

// Define the shape of the component's props
interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  analysis: string | null;
  error: string | null;
}

export function AnalysisModal({
  isOpen,
  onClose,
  isLoading,
  analysis,
  error,
}: AnalysisModalProps) {
  // Don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    // The "modal-overlay" is the dark background
    <div className="modal-overlay" onClick={onClose}>
      {/* The "modal-content" is the white box */}
      {/* We stop clicks here so clicking the box doesn't close it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2>Spending Analysis</h2>

        {/* Show a loading spinner */}
        {isLoading && (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Analyzing your spending...</p>
          </div>
        )}

        {/* Show an error message */}
        {error && (
          <div className="modal-error">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Show the successful analysis */}
        {analysis && !isLoading && (
          <div
            className="modal-analysis"
            // Format markdown: headings, bold, and lists
            dangerouslySetInnerHTML={{
              __html: analysis
                .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^\* (.*?)$/gm, '<li>$1</li>')
                .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
                .replace(/\n/g, '<br />'),
            }}
          ></div>
        )}
      </div>
    </div>
  );
}