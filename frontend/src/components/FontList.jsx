import React from "react";
import useFonts from "../hooks/useFonts";

const FontList = () => {
  const { fonts, deleteFont, loading, error } = useFonts();

  const handleDelete = (id) => {
    if (window.confirm("Delete this font?")) {
      deleteFont(id);
    }
  };

  return (
    <div className="mb-4">
      <h5>Our Fonts</h5>
      <small>Browse a list of Zepto fonts to build your font group.</small>

      {loading && <p className="text-info">Loading fonts...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && fonts.length > 0 && (
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Font Name</th>
              <th>Preview</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font, idx) => (
              <tr key={idx}>
                <td>{font.name}</td>
                <td
                  style={{
                    fontFamily: font.name
                      .replace(".ttf", "")
                      .replace(/\s+/g, "-"),
                  }}
                >
                  Example Style
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(font._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FontList;
