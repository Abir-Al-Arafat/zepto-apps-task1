import React from "react";

const FontUploader = ({ setFonts }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".ttf")) {
      const name = file.name.replace(".ttf", "").trim().replace(/\s+/g, "-"); // sanitize name
      const fontUrl = URL.createObjectURL(file);

      // Inject @font-face into a dynamic <style> tag
      const style = document.createElement("style");
      style.innerHTML = `
        @font-face {
          font-family: '${name}';
          src: url('${fontUrl}');
        }
      `;
      document.head.appendChild(style);

      setFonts((prev) => [...prev, { name, file, fontUrl }]);
    } else {
      alert("Only TTF files are allowed.");
    }
  };

  return (
    <div
      className="border rounded p-4 text-center bg-light mb-4"
      style={{ borderStyle: "dashed" }}
    >
      <input
        type="file"
        accept=".ttf"
        style={{ display: "none" }}
        id="font-upload"
        onChange={handleUpload}
      />
      <label htmlFor="font-upload" style={{ cursor: "pointer" }}>
        <div>
          <i className="bi bi-upload fs-2"></i>
          <br />
          <strong>Click to upload</strong> or drag and drop
          <br />
          <small>Only TTF File Allowed</small>
        </div>
      </label>
    </div>
  );
};

export default FontUploader;
