import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import {
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
  useConfig,
} from "@openmrs/esm-framework";

import { Result } from "../work-list/work-list.resource";
import { useCallback } from "react";

export function useMetrics() {
  const metrics = {
    orders: 15,
    in_progress: 4,
    transferred: 1,
    completed: 6,
  };
  const { data, error } = useSWR<{ data: { results: {} } }, Error>(
    `${restBaseUrl}/queue?`,
    openmrsFetch
  );

  return {
    metrics: metrics,
    isError: error,
    isLoading: !data && !error,
  };
}

export function useServices() {
  const serviceConceptSetUuid = "330c0ec6-0ac7-4b86-9c70-29d76f0ae20a";
  const apiUrl = `${restBaseUrl}/concept/${serviceConceptSetUuid}`;
  const { data } = useSWRImmutable<FetchResponse>(apiUrl, openmrsFetch);

  return {
    services: data
      ? data?.data?.setMembers?.map((setMember) => setMember?.display)
      : [],
  };
}

// worklist
export function useProcedureOrderStats(fulfillerStatus: string) {
  const procedureOrderTypeUuid = "4237a01f-29c5-4167-9d8e-96d6e590aa33"; // TODO Make configurable
  const orderTypeParam = `orderTypes=${procedureOrderTypeUuid}&fulfillerStatus=${fulfillerStatus}&v=custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const mutateOrders = useCallback(
    () =>
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(
            `${restBaseUrl}/order?orderType=${procedureOrderTypeUuid}`
          )
      ),
    [procedureOrderTypeUuid]
  );

  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Result> } },
    Error
  >(apiUrl, openmrsFetch);

  const radiologyOrders = data?.data?.results?.filter((order) => {
    if (
      order.concept.conceptClass.uuid === "8d490bf4-c2cc-11de-8d13-0010c6dffd0f"
    ) {
      return order;
    }
  });

  let length = 0;

  if (!fulfillerStatus) {
    const processedData = radiologyOrders?.filter(
      (d) => d.fulfillerStatus == null
    );
    length = processedData?.length;
  } else {
    length = data?.data ? data.data.results.length : 0;
  }
  return {
    count: length,
    isLoading,
    isError: error,
    mutate: mutateOrders,
  };
}
