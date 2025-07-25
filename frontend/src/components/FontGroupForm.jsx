import React, { useEffect, useState } from "react";

const FontGroupForm = ({
  fonts,
  editGroup,
  setEditGroup,
  createGroup,
  updateGroup,
  groupLoading,
  groupError,
  refetchGroups,
}) => {
  const [groupTitle, setGroupTitle] = useState("");
  const [rows, setRows] = useState([{ fontName: "" }]);

  useEffect(() => {
    if (editGroup) {
      setGroupTitle(editGroup.name);
      setRows(editGroup.fonts.map((font) => ({ fontName: font })));
    }
  }, [editGroup]);

  const handleAddRow = () => setRows([...rows, { fontName: "" }]);
  const handleRemoveRow = (index) =>
    setRows(rows.filter((_, i) => i !== index));
  const handleChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].fontName = value;
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    const selectedFonts = rows.map((r) => r.fontName).filter((name) => name);
    if (selectedFonts.length < 2) return alert("Select at least 2 fonts.");
    if (!groupTitle.trim()) return alert("Group name required");

    if (editGroup) {
      await updateGroup({
        groupId: editGroup.id,
        name: groupTitle.trim(),
        fonts: selectedFonts,
      });
      setEditGroup(null);
    } else {
      await createGroup({ name: groupTitle.trim(), fonts: selectedFonts });
    }

    await refetchGroups(); // 🟢 Refresh group list after action
    setGroupTitle("");
    setRows([{ fontName: "" }]);
  };

  const handleCancelEdit = () => {
    setEditGroup(null);
    setGroupTitle("");
    setRows([{ fontName: "" }]);
  };

  return (
    <div className="mt-4">
      <h5>{editGroup ? "Edit Font Group" : "Create Font Group"}</h5>
      <small className="text-muted">You must select at least 2 fonts.</small>

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
        + Add Font
      </button>
      <br />
      <button
        className="btn btn-success me-2"
        onClick={handleSubmit}
        disabled={groupLoading}
      >
        {editGroup ? "Update Group" : "Create Group"}
      </button>

      {editGroup && (
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancelEdit}
        >
          Cancel Edit
        </button>
      )}

      {groupError && <p className="text-danger mt-2">{groupError}</p>}
    </div>
  );
};

export default FontGroupForm;
