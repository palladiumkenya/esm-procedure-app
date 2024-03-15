import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createLeftPanelLink } from "./left-panel-link";
import worklistTile from "./procedure-tiles/worklist-tile.component";
import referredTile from "./procedure-tiles/referred-tile.component";
import completedTile from "./procedure-tiles/completed-tile.component";
import testsOrdered from "./procedure-tiles/tests-ordered-tile.component";
import workListProcedures from "./procedure-tabs/work-list-tab.component";
import referredProcedures from "./procedure-tabs/referred-tab.component";
import completedProcedures from "./procedure-tabs/completed-tab.component";
import orderedTile from "./procedure-tiles/procedures-ordered-tile.component";

const moduleName = "@openmrs/esm-procedure-app";

const options = {
  featureName: "root-world",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const procedureDashboardLink = getSyncLifecycle(
  createLeftPanelLink({
    name: "procedure",
    title: "Procedures",
  }),
  options
);

export const worklistTileComponent = getSyncLifecycle(worklistTile, options);

export const referredTileComponent = getSyncLifecycle(referredTile, options);

export const completedTileComponent = getSyncLifecycle(completedTile, options);

export const OrderedTileComponent = getSyncLifecycle(orderedTile, options);

export const worklistProceduresTabComponent = getSyncLifecycle(workListProcedures, options);

export const referredProceduresTabComponent = getSyncLifecycle(referredProcedures, options);

export const completedProceduresTabComponent = getSyncLifecycle(completedProcedures, options);
