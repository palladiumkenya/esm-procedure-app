/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
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

const moduleName = "@openmrs/esm-procedure-app";

const options = {
  featureName: "root-world",
  moduleName,
};

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/root`.
 */
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

export const testOrderedTileComponent = getSyncLifecycle(testsOrdered, options);
