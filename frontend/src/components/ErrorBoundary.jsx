import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Toolzz ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          backgroundColor: "#09090b",
          color: "#f4f4f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center"
        }}>
          <div style={{
            background: "#121215",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "32px 40px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
          }}>
            <AlertOctagon size={44} style={{ color: "#fb7185", marginBottom: "16px" }} />
            <h2 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>Toolzz Application Error</h2>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "20px" }}>
              {this.state.error?.message || "An unexpected error occurred while loading the workspace."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                backgroundColor: "#ffffff",
                color: "#09090b",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RotateCcw size={16} />
              <span>Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
