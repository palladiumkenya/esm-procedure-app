import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./procedure-summary-tiles.scss";
import {
  AssignedExtension,
  ExtensionSlot,
  useConnectedExtensions,
  useSession,
  attach,
  detachAll,
  Extension,
} from "@openmrs/esm-framework";
import { ComponentContext } from "@openmrs/esm-framework/src/internal";
import SummaryTile from "./summary-tile.component";

const ProcedureSummaryTiles: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const ProcedureTileSlot = "procedure-tiles-slot";

  const tilesExtensions = useConnectedExtensions(
    ProcedureTileSlot
  ) as AssignedExtension[];

  return (
    <div className={styles.cardContainer}>
      {tilesExtensions
        .filter((extension) => Object.keys(extension.meta).length > 0)
        .map((extension, index) => {
          return (
            <ComponentContext.Provider
              key={extension.id}
              value={{
                moduleName: extension.moduleName,
                extension: {
                  extensionId: extension.id,
                  extensionSlotName: ProcedureTileSlot,
                  extensionSlotModuleName: extension.moduleName,
                },
              }}
            >
              <Extension />
            </ComponentContext.Provider>
          );
        })}
    </div>
  );
};

export default ProcedureSummaryTiles;
