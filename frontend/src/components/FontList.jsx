import React from "react";

const FontList = ({ fonts }) => {
  return (
    <div className="mb-4">
      <h5>Our Fonts</h5>
      <small>Browse a list of Zepto fonts to build your font group.</small>
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
              <td style={{ fontFamily: font.name }}>Example Style</td>
              <td>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FontList;
