import React from "react";

const FontGroupList = ({
  groups = [],
  deleteGroup,
  setEditGroup,
  groupLoading,
  groupError,
}) => {
  console.log("groups", groups);
  return (
    <div className="mt-5">
      <h5>All Font Groups</h5>

      {groupLoading && <p className="text-info">Loading...</p>}
      {groupError && <p className="text-danger">{groupError}</p>}

      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <ul className="list-group">
          {groups.map((group) => (
            <li className="list-group-item" key={group.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{group.name}</strong>
                  <br />
                  <small>{group.fonts.join(", ")}</small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => setEditGroup(group)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteGroup(group.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FontGroupList;
