import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:3005/fonts"; // adjust to your backend

const useFonts = () => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const injectFontFace = (name, url) => {
    const fontName = name.replace(".ttf", "").trim().replace(/\s+/g, "-");

    // Avoid duplicate injection
    if (document.getElementById(`font-${fontName}`)) return;

    const style = document.createElement("style");
    style.id = `font-${fontName}`;
    style.innerHTML = `
      @font-face {
        font-family: '${fontName}';
        src: url('${url}');
      }
    `;
    document.head.appendChild(style);
  };

  // GET Fonts
  const fetchFonts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.success || json.fonts) {
        const fetchedFonts = json.fonts || json.data || [];

        // Inject all fonts into browser
        fetchedFonts.forEach((font) => {
          const fullUrl = `${API_URL.replace("/fonts", "")}${font.path}`;
          injectFontFace(font.name, fullUrl);
        });

        setFonts(fetchedFonts);
      } else {
        setError(json.message || "Failed to load fonts");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload Font
  const uploadFont = async (file) => {
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("font", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        await fetchFonts();
      } else {
        setError(json.message || "Upload failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Font
  const deleteFont = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        await fetchFonts();
      } else {
        setError(json.message || "Delete failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts();
  }, [fetchFonts]);

  return {
    fonts,
    loading,
    error,
    uploadFont,
    deleteFont,
    refetchFonts: fetchFonts,
  };
};

export default useFonts;
