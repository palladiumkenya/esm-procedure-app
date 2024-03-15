import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  return (
    <SummaryTile
      label={t("referred", "Referred")}
      value={0}
      headerLabel={t("referredProcedures", "Referred")}
    />
  );
};

export default ReferredTileComponent;
