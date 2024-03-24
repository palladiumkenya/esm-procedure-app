import { ConfigObject, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import useSWR from "swr";
import { Result } from "../work-list/work-list.resource";
import { ProcedureConceptClass_UUID } from "../constants";
export function useOrdersWorklist(
  activatedOnOrAfterDate: string,
  fulfillerStatus: string
) {
  const config = useConfig() as ConfigObject;

  const responseFormat =
    "custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass:(uuid)),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)";
  const orderTypeParam = `orderTypes=${config.procedureOrderTypeUuid}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Result> } },
    Error
  >(apiUrl, openmrsFetch);

  const orders = data?.data?.results?.filter((order) => {
    if (fulfillerStatus === "") {
      return (
        order.fulfillerStatus === null &&
        order.dateStopped === null &&
        order.action === "NEW" &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === "IN_PROGRESS") {
      return (
        order.fulfillerStatus === "IN_PROGRESS" &&
        order.dateStopped === null &&
        order.action !== "DISCONTINUE" &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    } else if (fulfillerStatus === "COMPLETED") {
      return (
        order.fulfillerStatus === "COMPLETED" &&
        order.dateStopped === null &&
        order.action !== "DISCONTINUE" &&
        order.concept.conceptClass.uuid === ProcedureConceptClass_UUID
      );
    }
  });

  return {
    workListEntries: orders?.length > 0 ? orders : [],
    isLoading,
    isError: error,
  };
}
