import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import {
  ConfigObject,
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
  useConfig,
} from "@openmrs/esm-framework";

import { Result } from "../work-list/work-list.resource";
import { useCallback } from "react";
import {
  ProcedureConceptClass_UUID,
  ServiceConceptSet_UUID,
} from "../constants";

export function useMetrics() {
  const metrics = {
    orders: 15,
    in_progress: 4,
    transferred: 1,
    completed: 6,
  };
  const { data, error } = useSWR<{ data: { results: any } }, Error>(
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
  const apiUrl = `${restBaseUrl}/concept/${ServiceConceptSet_UUID}`;
  const { data } = useSWRImmutable<FetchResponse>(apiUrl, openmrsFetch);

  return {
    services: data
      ? data?.data?.setMembers?.map((setMember) => setMember?.display)
      : [],
  };
}

// worklist
export function useProcedureOrderStats(fulfillerStatus: string) {
  const config = useConfig() as ConfigObject;

  const orderTypeParam = `orderTypes=${config.procedureOrderTypeUuid}&fulfillerStatus=${fulfillerStatus}&v=custom:(uuid,orderNumber,patient:ref,concept:(uuid,display,conceptClass),action,careSetting,orderer:ref,urgency,instructions,commentToFulfiller,display,fulfillerStatus,dateStopped)`;
  const apiUrl = `/ws/rest/v1/order?${orderTypeParam}`;

  const mutateOrders = useCallback(
    () =>
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(
            `${restBaseUrl}/order?orderType=${config.procedureOrderTypeUuid}`
          )
      ),
    [config.procedureOrderTypeUuid]
  );

  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Result> } },
    Error
  >(apiUrl, openmrsFetch);

  const procedureOrders = data?.data?.results?.filter((order) => {
    if (order.concept.conceptClass.uuid === ProcedureConceptClass_UUID) {
      return order;
    }
  });

  let length = 0;

  if (!fulfillerStatus) {
    const processedData = procedureOrders?.filter(
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
