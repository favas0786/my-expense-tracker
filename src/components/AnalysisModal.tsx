import { X } from "lucide-react";

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

  if (!isOpen) {
    return null;
  }

  return (
   
    <div className="modal-overlay" onClick={onClose}>
    
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2>Spending Analysis</h2>

        {isLoading && (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Analyzing your spending...</p>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}


        {analysis && !isLoading && (
          <div
            className="modal-analysis"
            
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