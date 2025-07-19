import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";

function App() {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  return (
    <>
      <FontUploader />
      <FontList fonts={fonts} />

      <hr />

      <FontGroupForm fonts={fonts} setFontGroups={setFontGroups} />
    </>
  );
}

export default App;
