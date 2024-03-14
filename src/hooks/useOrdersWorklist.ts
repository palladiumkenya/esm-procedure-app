import { openmrsFetch } from "@openmrs/esm-framework";
import useSWR from "swr";
import { Result } from "../work-list/work-list.resource";

export function useOrdersWorklist(
  activatedOnOrAfterDate: string,
  fulfillerStatus: string
) {
  const procedureOrderType = "4237a01f-29c5-4167-9d8e-96d6e590aa33";
  const responseFormat =
    "custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass:(uuid)),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)";
  const orderTypeParam = `orderTypes=${procedureOrderType}&activatedOnOrAfterDate=${activatedOnOrAfterDate}&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=${responseFormat}`;
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
        order.concept.conceptClass.uuid ===
          "8d490bf4-c2cc-11de-8d13-0010c6dffd0f"
      );
    } else if (fulfillerStatus === "IN_PROGRESS") {
      return (
        order.fulfillerStatus === "IN_PROGRESS" &&
        order.dateStopped === null &&
        order.action !== "DISCONTINUE" &&
        order.concept.conceptClass.uuid ===
          "8d490bf4-c2cc-11de-8d13-0010c6dffd0f"
      );
    }
  });

  return {
    workListEntries: orders?.length > 0 ? orders : [],
    isLoading,
    isError: error,
  };
}
