export type BgStyle = "dots" | "grid" | "orbs" | "lines" | "circuit" | "none";

export default function SectionBg({
  style = "orbs",
  flip = false,
}: {
  style?: BgStyle;
  flip?: boolean;
}) {
  if (style === "none") return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {style === "dots" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(37,99,235,0.25) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: flip ? "auto" : 0,
              bottom: flip ? 0 : "auto",
              left: "10%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </>
      )}

      {style === "grid" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "5%",
              width: 350,
              height: 350,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {style === "orbs" && (
        <>
          <div
            style={{
              position: "absolute",
              top: flip ? "auto" : "10%",
              bottom: flip ? "10%" : "auto",
              left: "5%",
              width: 350,
              height: 350,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: flip ? "10%" : "auto",
              bottom: flip ? "auto" : "10%",
              right: "5%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </>
      )}

      {style === "lines" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(37,99,235,0.04) 40px, rgba(37,99,235,0.04) 41px)",
            opacity: 0.8,
          }}
        />
      )}

      {style === "circuit" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
        </>
      )}
    </div>
  );
}
