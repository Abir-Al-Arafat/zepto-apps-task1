import React from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

import useFonts from "../hooks/useFonts";

const FontUploader = ({ uploadFont, loading, error }) => {
  // const { uploadFont, loading, error } = useFonts();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".ttf")) {
      alert("Only .ttf files are allowed.");
      return;
    }
    uploadFont(file);
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
          <strong>Click to upload</strong> or drag and drop
          <br />
          <small>Only TTF File Allowed</small>
        </div>
      </label>

      {loading && <p className="text-info mt-2">Uploading...</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default FontUploader;
