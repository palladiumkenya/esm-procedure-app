/**
 * From here, the application is pretty typical React, but with lots of
 * support from `@openmrs/esm-framework`. Check out `Greeter` to see
 * usage of the configuration system, and check out `PatientGetter` to
 * see data fetching using the OpenMRS FHIR API.
 *
 * Check out the Config docs:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 */

import React from "react";
import { ProcedureHeader } from "./header/procedure-header.component";
import ProcedureSummaryTiles from "./summary-tiles/procedure-summary-tiles.component";
import ProcedureOrdersList from "./procedures-ordered/procedure-tabs.component";
import Overlay from "./components/overlay/overlay.component";


const Procedure: React.FC = () => {
   return (
    <div className={`omrs-main-content`}>
      <ProcedureHeader />
      <ProcedureSummaryTiles />
      <ProcedureOrdersList />
      <Overlay />
    </div>
  );
};

export default Procedure;
