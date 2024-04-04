import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  procedureOrderTypeUuid: {
    _type: Type.String,
    _description: "Procedure Order type UUID",
    _default: "4237a01f-29c5-4167-9d8e-96d6e590aa33",
  },
  testOrderTypeUuid: {
    _type: Type.String,
    _description: "Test Order type UUID",
    _default: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
  },
  orders: {
    _type: Type.Object,
    _description: "List of lab orderable concepts",
    _default: {
      labOrderableConcepts: [],
      labOrderTypeUuid: "",
    },
  },
  conditionConceptClassUuid: {
    _type: Type.ConceptUuid,
    _description: "The concept class UUID for conditions",
    _default: "8d4918b0-c2cc-11de-8d13-0010c6dffd0f",
  },
};

export interface OrderReason {
  labTestUuid: string;
  required: boolean;
  orderReasons: Array<string>;
}

export interface ConfigObject {
  procedureOrderTypeUuid: string;
  testOrderTypeUuid: string;
  labTestsWithOrderReasons: Array<OrderReason>;
  showPrintButton: boolean;
  orders: {
    labOrderTypeUuid: string;
    labOrderableConcepts: Array<string>;
  };
  conditionConceptClassUuid: string;
}
