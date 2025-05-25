import React from "react";

export default function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#242424",
      color: "#fff",
      textAlign: "center",
      padding: "0 20px"
    }}>
      <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.25rem", margin: "8px 0 24px" }}>
        Stranica nije pronađena.
      </p>
      <button
        onClick={() => window.location.href = "/"}
        style={{
          padding: "8px 16px",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "none",
          background: "#646cff",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Vrati se na početnu
      </button>
    </div>
  );
}
