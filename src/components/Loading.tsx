import { Spinner } from "spin.js";
import { useEffect } from "react";

function LoadScreen() {
  useEffect(() => {
    const target = document.getElementById("spinner") || undefined;
    new Spinner({ color: "black" }).spin(target);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5">
      <h2 className="text-xl text-center">Loading</h2>
      <div id="spinner" className="text-center"></div>
    </div>
  );
}

export default LoadScreen;
