import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useProcedureOrderStats } from "../summary-tiles/procedure-summary.resource";

const ReferredOutProceduresTileComponent = () => {
  const { t } = useTranslation();
  const { count: referredOutCount } = useProcedureOrderStats("EXCEPTION");

  return (
    <SummaryTile
      label={t("transferredOut", "Transferred")}
      value={referredOutCount}
      headerLabel={t("referredOutProcedures", "Referred Out")}
    />
  );
};

export default ReferredOutProceduresTileComponent;
