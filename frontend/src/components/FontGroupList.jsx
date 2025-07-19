import React from "react";

const FontGroupList = ({ fontGroups, setFontGroups }) => {
  const handleDelete = (index) => {
    setFontGroups((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-5">
      <h5>All Font Groups</h5>
      {fontGroups.length === 0 ? (
        <p>No font groups created yet.</p>
      ) : (
        <ul className="list-group">
          {fontGroups.map((group, idx) => (
            <li
              className="list-group-item d-flex justify-content-between"
              key={idx}
            >
              <div>
                <strong>{group.title}</strong>
                <br />
                <small>{group.fonts.map((f) => f.fontName).join(", ")}</small>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(idx)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FontGroupList;
