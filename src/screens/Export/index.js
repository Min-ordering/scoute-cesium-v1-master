import React, { useContext, useEffect, createContext } from "react";
import BottomBar from "../../components/BottomBar";
import { setToolbarsVisibility } from "../../rest/util";

function Export() {
  useEffect(() => {
    setToolbarsVisibility(true);
  }, []);
  
  return (
    <div className="sidebar">
      <BottomBar />
    </div>
  );
}

export default Export;