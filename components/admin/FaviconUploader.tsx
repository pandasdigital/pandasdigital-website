"use client";
import { useState, useRef } from "react";

export default function FaviconUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return alert("Please select a file first");

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/favicon", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          ok: true,
          msg: "✅ Favicon uploaded! Changes show after redeploy.",
        });
      } else {
        setResult({ ok: false, msg: `❌ ${data.error}` });
      }
    } catch {
      setResult({ ok: false, msg: "❌ Upload failed. Try again." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {preview && (
          <div
            style={{
              width: 40,
              height: 40,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".ico,.png,.svg,.jpg,.jpeg"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="favicon-input"
        />
        <label
          htmlFor="favicon-input"
          style={{
            padding: "8px 16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            color: "#374151",
            fontWeight: 500,
          }}
        >
          Choose File
        </label>
        <button
          onClick={handleUpload}
          disabled={uploading || !preview}
          className="btn-primary"
          style={{
            fontSize: 13,
            padding: "8px 16px",
            opacity: !preview ? 0.5 : 1,
          }}
        >
          {uploading ? "Uploading..." : "Upload Favicon"}
        </button>
      </div>

      {result && (
        <p
          style={{
            marginTop: 10,
            fontSize: 13,
            color: result.ok ? "#166534" : "#991b1b",
            background: result.ok ? "#dcfce7" : "#fee2e2",
            padding: "8px 12px",
            borderRadius: 8,
          }}
        >
          {result.msg}
        </p>
      )}

      <p style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
        Supported: .ico, .png, .svg · Recommended: 32×32px or 64×64px
      </p>
    </div>
  );
}
