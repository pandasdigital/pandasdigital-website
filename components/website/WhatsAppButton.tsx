export default function WhatsAppButton() {
  return (
    <>
      <style>{`
        @keyframes wa-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .wa-btn { animation: wa-pulse 2s ease-in-out infinite; }
        .wa-btn:hover { transform: scale(1.12) !important; animation: none; }
      `}</style>
      <a
        href="https://wa.me/94770000000"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          left: 28,
          zIndex: 999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25d366, #128c7e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          transition: "transform 0.2s ease",
        }}
      >
        💬
      </a>
    </>
  );
}
