import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";

const ReferredComponent = () => {
  return (
    <div>
      <EmptyState
        displayText={"referred procedures"}
        headerTitle={"Referred procedures"}
      />
    </div>
  );
};

export default ReferredComponent;
