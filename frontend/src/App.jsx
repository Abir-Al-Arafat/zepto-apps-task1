import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import FontUploader from "./components/FontUploader";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FontUploader />
    </>
  );
}

export default App;
