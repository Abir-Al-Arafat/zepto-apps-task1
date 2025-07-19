import React from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
const FontUploader = ({ setFonts }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".ttf")) {
      setFonts((prev) => [
        ...prev,
        { name: file.name.replace(".ttf", ""), file },
      ]);
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
          <IoCloudUploadOutline className="fs-2" />
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
