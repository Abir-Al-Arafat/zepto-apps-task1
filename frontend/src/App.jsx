import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";

function App() {
  const [fonts, setFonts] = useState([]);

  return (
    <>
      <FontUploader />
      <FontList fonts={fonts} />
    </>
  );
}

export default App;
