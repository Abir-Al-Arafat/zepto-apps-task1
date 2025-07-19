import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";
import FontGroupList from "./components/FontGroupList";

function App() {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  return (
    <>
      <div className="container py-5">
        <FontUploader setFonts={setFonts} />
        <FontList fonts={fonts} />

        <hr />

        <FontGroupForm fonts={fonts} setFontGroups={setFontGroups} />
        <FontGroupList fontGroups={fontGroups} setFontGroups={setFontGroups} />
      </div>
    </>
  );
}

export default App;
