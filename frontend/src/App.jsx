import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import useFonts from "./hooks/useFonts";
import useFontGroups from "./hooks/useFontGroups";

import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";
import FontGroupList from "./components/FontGroupList";

function App() {
  const { fonts, loading, error, uploadFont, deleteFont, refetchFonts } =
    useFonts();
  const {
    groups,
    loading: groupLoading,
    error: groupError,
    createGroup,
    deleteGroup,
    updateGroup,
    findFontInGroups,
    deleteFontFromGroup,
    refetchGroups,
  } = useFontGroups();
  // state for FontGroupForm
  const [editGroup, setEditGroup] = useState(null);

  const handleDeleteFont = async (id, fontName) => {
    try {
      const groups = await findFontInGroups(fontName);
      console.log("groups findFontInGroups(fontName)", groups);
      if (groups.length) {
        await deleteFontFromGroup({ fontName });
        await refetchGroups();
      }

      await deleteFont(id);
      await refetchFonts();
    } catch (err) {
      console.error("Error deleting font and cleaning up groups:", err);
    }
  };

  return (
    <>
      <div className="container py-5">
        <FontUploader uploadFont={uploadFont} loading={loading} error={error} />
        <FontList
          fonts={fonts}
          loading={loading}
          error={error}
          deleteFont={handleDeleteFont}
        />

        <hr />

        <FontGroupForm
          fonts={fonts}
          editGroup={editGroup}
          setEditGroup={setEditGroup}
          createGroup={createGroup}
          updateGroup={updateGroup}
          groupLoading={groupLoading}
          groupError={groupError}
          refetchGroups={refetchGroups}
        />
        <FontGroupList
          groups={groups}
          deleteGroup={deleteGroup}
          setEditGroup={setEditGroup}
          groupLoading={groupLoading}
          groupError={groupError}
        />
      </div>
    </>
  );
}

export default App;
