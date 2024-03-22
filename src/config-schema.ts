import { Type, validator } from "@openmrs/esm-framework";

export const configSchema = {
  casualGreeting: {
    _type: Type.Boolean,
    _default: false,
    _description: "Whether to use a casual greeting (or a formal one).",
  },
  whoToGreet: {
    _type: Type.Array,
    _default: ["World"],
    _description:
      "Who should be greeted. Names will be separated by a comma and space.",
    _elements: {
      _type: Type.String,
    },
    _validators: [
      validator((v) => v.length > 0, "At least one person must be greeted."),
    ],
  },
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
};

export type Config = {
  casualGreeting: boolean;
  whoToGreet: Array<string>;
};

export interface ConfigObject {
  procedureOrderTypeUuid: string;
  testOrderTypeUuid: string
}
