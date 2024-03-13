import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  return (
    <SummaryTile
      label={t("transferred", "Transferred")}
      value={0}
      headerLabel={t("referredProcedures", "Referred Procedures")}
    />
  );
};

export default ReferredTileComponent;
