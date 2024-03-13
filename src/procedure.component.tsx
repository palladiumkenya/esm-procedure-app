import React from "react";
import { ProcedureHeader } from "./header/procedure-header.component";
import ProcedureSummaryTiles from "./summary-tiles/procedure-summary-tiles.component";
import Overlay from "./components/overlay/overlay.component";

const Procedure: React.FC = () => {
  return (
    <div className={`omrs-main-content`}>
      <ProcedureHeader />
      <ProcedureSummaryTiles />
      <Overlay />
    </div>
  );
};

export default Procedure;
