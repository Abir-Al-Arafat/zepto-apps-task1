import React, { useState } from "react";

const FontGroupForm = ({ fonts, setFontGroups }) => {
  const [groupTitle, setGroupTitle] = useState("");
  const [rows, setRows] = useState([{ fontName: "" }]);

  const handleAddRow = () => setRows([...rows, { fontName: "" }]);
  const handleRemoveRow = (index) =>
    setRows(rows.filter((_, i) => i !== index));

  const handleChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].fontName = value;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    const selected = rows.filter((row) => row.fontName !== "");
    if (selected.length < 2) return alert("Select at least 2 fonts.");

    setFontGroups((prev) => [...prev, { title: groupTitle, fonts: selected }]);
    setGroupTitle("");
    setRows([{ fontName: "" }]);
  };

  return (
    <div>
      <h5>Create Font Group</h5>
      <small className="text-muted">
        You have to select at least two fonts
      </small>
      <input
        className="form-control mt-2 mb-3"
        placeholder="Group Title"
        value={groupTitle}
        onChange={(e) => setGroupTitle(e.target.value)}
      />
      {rows.map((row, idx) => (
        <div className="row mb-2" key={idx}>
          <div className="col">
            <select
              className="form-select"
              value={row.fontName}
              onChange={(e) => handleChange(idx, e.target.value)}
            >
              <option value="">Select a Font</option>
              {fonts.map((f, i) => (
                <option key={i} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-danger"
              onClick={() => handleRemoveRow(idx)}
              disabled={rows.length <= 1}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary mb-3" onClick={handleAddRow}>
        + Add Row
      </button>
      <br />
      <button className="btn btn-success" onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
};

export default FontGroupForm;
