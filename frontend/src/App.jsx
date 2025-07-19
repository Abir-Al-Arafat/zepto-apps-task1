import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import useFonts from "./hooks/useFonts";

import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";
import FontGroupList from "./components/FontGroupList";

function App() {
  const { fonts, loading, error, uploadFont, deleteFont, refetchFonts } =
    useFonts();
  // const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  return (
    <>
      <div className="container py-5">
        <FontUploader uploadFont={uploadFont} loading={loading} error={error} />
        <FontList
          fonts={fonts}
          loading={loading}
          error={error}
          deleteFont={deleteFont}
        />

        <hr />

        <FontGroupForm fonts={fonts} setFontGroups={setFontGroups} />
        <FontGroupList fontGroups={fontGroups} setFontGroups={setFontGroups} />
      </div>
    </>
  );
}

export default App;
