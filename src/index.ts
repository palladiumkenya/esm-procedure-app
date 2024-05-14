import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
  translateFrom,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createLeftPanelLink } from "./left-panel-link";
import orderedProcedureTile from "./procedure-tiles/procedures-ordered-tile.component";
import worklistProcedureTile from "./procedure-tiles/worklist-tile.component";
import referredOutProcedureTile from "./procedure-tiles/referred-tile.component";
import completedProcedureTile from "./procedure-tiles/completed-tile.component";
import notDoneProcedureTile from "./procedure-tiles/not-done-tile.component";
import workListProcedures from "./procedure-tabs/work-list-tab.component";
import referredProcedures from "./procedure-tabs/referred-tab.component";
import completedProcedures from "./procedure-tabs/completed-tab.component";
import notDoneProcedures from "./procedure-tabs/not-done-tab.component";
import addProcedureToWorklistDialog from "./procedures-ordered/pick-procedure-order/add-to-worklist-dialog.component";
import procedureInstructionsModal from "./procedures-ordered/procedure-instructions/procedure-instructions.component";
import { registerWorkspace } from "@openmrs/esm-patient-common-lib";
import ProceduresOrderBasketPanelExtension from "./form/procedures-orders/procedures-order-basket-panel/procedures-order-basket-panel.extension";
import rejectProcedureOrderDialog from "./procedures-ordered/reject-order-dialog/reject-procedure-order-dialog.component";
import procedureRejectReasonModal from "./procedures-ordered/reject-reason/procedure-reject-reason.component";

const moduleName = "@kenyaemr/esm-procedure-app";

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

// Modals
export const rejectProcedureOrderDialogComponent = getSyncLifecycle(
  rejectProcedureOrderDialog,
  options
);

export const worklistProcedureTileComponent = getSyncLifecycle(
  worklistProcedureTile,
  options
);
export const referredOutProcedureTileComponent = getSyncLifecycle(
  referredOutProcedureTile,
  options
);
export const completedProcedureTileComponent = getSyncLifecycle(
  completedProcedureTile,
  options
);
export const OrderedProcedureTileComponent = getSyncLifecycle(
  orderedProcedureTile,
  options
);
export const notDoneProcedureTileComponent = getSyncLifecycle(
  notDoneProcedureTile,
  options
);
export const worklistProceduresTabComponent = getSyncLifecycle(
  workListProcedures,
  options
);

export const referredProceduresTabComponent = getSyncLifecycle(
  referredProcedures,
  options
);
export const completedProceduresTabComponent = getSyncLifecycle(
  completedProcedures,
  options
);
export const notDoneProceduresTabComponent = getSyncLifecycle(
  notDoneProcedures,
  options
);
export const procedureInstructionsModalComponent = getSyncLifecycle(
  procedureInstructionsModal,
  options
);
export const procedureRejectModalComponent = getSyncLifecycle(
  procedureRejectReasonModal,
  options
);
export const addProcedureToWorklistDialogComponent = getSyncLifecycle(
  addProcedureToWorklistDialog,
  options
);

export const proceduresOrderPanel = getSyncLifecycle(
  ProceduresOrderBasketPanelExtension,
  options
);

// t('addProcedureOrderWorkspaceTitle', 'Add procedure order')
registerWorkspace({
  name: "add-procedures-order",
  type: "order",
  title: translateFrom(
    moduleName,
    "addProceduresOrderWorkspaceTitle",
    "Add procedures order"
  ),
  load: getAsyncLifecycle(
    () =>
      import(
        "./form/procedures-orders/add-procedures-order/add-procedures-order.workspace"
      ),
    options
  ),
});
