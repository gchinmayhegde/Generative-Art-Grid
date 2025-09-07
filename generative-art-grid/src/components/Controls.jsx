import React, { useState } from "react";
import { FaSave, FaRedo } from "react-icons/fa";
import html2canvas from "html2canvas";

export default function Controls({ onRefresh, exportRef }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!exportRef.current) return;
    setSaving(true);
    try {
      // increase scale for higher-res image
      const canvas = await html2canvas(exportRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `generative-art-grid-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export image.");
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md btn-gradient text-white font-medium shadow-lg hover:scale-105 transition-transform"
          onClick={onRefresh}
        >
          <FaRedo /> 🎲 Refresh Grid
        </button>
      </div>

      <div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/6 text-white font-medium shadow hover:scale-105 transition-transform"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? "Saving…" : "💾 Save as PNG"}
        </button>
      </div>
    </div>
  );
}
