import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import { ReferredProcedures } from "../referred-procedures/referred-procedures.component";

const ReferredComponent = () => {
  return (
    <div>
      <ReferredProcedures fulfillerStatus={"EXCEPTION"} />
    </div>
  );
};

export default ReferredComponent;
