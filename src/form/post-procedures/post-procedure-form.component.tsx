import React, { useCallback, useState } from "react";
import {
  OpenmrsDatePicker,
  showSnackbar,
  useConfig,
  useDebounce,
  useSession,
} from "@openmrs/esm-framework";
import {
  Form,
  Stack,
  ComboBox,
  TextArea,
  MultiSelect,
  Layer,
  FormLabel,
  ButtonSet,
  Button,
  Search,
  InlineLoading,
  Tile,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./post-procedure-form.scss";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  savePostProcedure,
  useConditionsSearch,
  useProvidersSearch,
} from "./post-procedure.resource";
import { CodedProvider, CodedCondition, ProcedurePayload } from "../../types";
import { Result } from "../../work-list/work-list.resource";
import dayjs from "dayjs";
import { closeOverlay } from "../../components/overlay/hook";
import { type ConfigObject } from "../../config-schema";

const validationSchema = z.object({
  startDatetime: z.date({ required_error: "Start datetime is required" }),
  endDatetime: z.date({ required_error: "End datetime is required" }),
  outcome: z.string({ required_error: "Outcome is required" }),
  procedureReport: z.string({ required_error: "Procedure report is required" }),
  participants: z.array(
    z.object({
      uuid: z.string(),
      display: z.string(),
      person: z.object({
        uuid: z.string(),
        display: z.string(),
      }),
    }),
    { required_error: "Participants are required" }
  ),
  complications: z.string().optional(),
});

type PostProcedureFormSchema = z.infer<typeof validationSchema>;

type PostProcedureFormProps = {
  patientUuid: string;
  procedure: Result;
};

const PostProcedureForm: React.FC<PostProcedureFormProps> = ({
  patientUuid,
  procedure,
}) => {
  const { sessionLocation } = useSession();
  const { t } = useTranslation();

  const [providerSearchTerm, setProviderSearchTerm] = useState("");
  const debouncedProviderSearchTerm = useDebounce(providerSearchTerm);
  const { providerSearchResults, isProviderSearching } = useProvidersSearch(
    debouncedProviderSearchTerm
  );
  const [selectedProvider, setSelectedProvider] = useState<CodedProvider>(null);
  const handleProviderSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setProviderSearchTerm(event.target.value);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { searchResults, isSearching } =
    useConditionsSearch(debouncedSearchTerm);
  const [selectedCondition, setSelectedCondition] =
    useState<CodedCondition>(null);
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const {
    procedureComplicationGroupingConceptUuid,
    procedureComplicationConceptUuid,
    procedureParticipantsGroupingConceptUuid,
    procedureParticipantsConceptUuid,
  } = useConfig<ConfigObject>();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<PostProcedureFormSchema>({
    defaultValues: {},
    resolver: zodResolver(validationSchema),
  });

  const handleProviderChange = useCallback(
    (selectedProvider: CodedProvider) => {
      setSelectedProvider(selectedProvider);
    },
    []
  );

  const handleConditionChange = useCallback(
    (selectedCondition: CodedCondition) => {
      setSelectedCondition(selectedCondition);
    },
    []
  );

  const onSubmit = async (data: PostProcedureFormSchema) => {
    const participants = [];
    if (selectedProvider) {
      const provider = {
        provider: selectedProvider.concept.uuid,
        encounterRole: "a0b03050-c99b-11e0-9572-0800200c9a66",
      };
      participants.push(provider);
    }
    const complications = [];
    if (selectedCondition) {
      complications.push({
        groupMembers: [
          {
            concept: procedureComplicationConceptUuid,
            value: selectedCondition.concept.uuid,
          },
        ],
        concept: procedureComplicationGroupingConceptUuid,
      });
    }

    const payload: ProcedurePayload = {
      patient: patientUuid,
      procedureOrder: procedure.uuid,
      concept: procedure.concept.uuid,
      procedureReason: procedure.orderReason?.uuid,
      category: procedure.orderType?.uuid,
      status: "COMPLETED",
      outcome: data.outcome,
      location: sessionLocation?.uuid,
      startDatetime: dayjs(data.startDatetime).format("YYYY-MM-DDTHH:mm:ssZ"),
      endDatetime: dayjs(data.endDatetime).format("YYYY-MM-DDTHH:mm:ssZ"),
      procedureReport: data.procedureReport,
      encounters: [
        {
          encounterDatetime: new Date(),
          patient: patientUuid,
          encounterType: "d1059fb9-a079-4feb-a749-eedd709ae542",
          encounterProviders: participants,
          obs: complications,
        },
      ],
    };

    try {
      const response = await savePostProcedure(payload);
      response.status === 201 &&
        showSnackbar({
          title: t("procedureSaved", "Procedure saved"),
          subtitle: t(
            "procedureSavedSuccessfully",
            "Procedure saved successfully"
          ),
          timeoutInMs: 5000,
          isLowContrast: true,
          kind: "success",
        });
      closeOverlay();
    } catch (error) {
      console.error(error);
      showSnackbar({
        title: t("error", "Error"),
        subtitle: t("errorSavingProcedure", "Error saving procedure"),
        timeoutInMs: 5000,
        isLowContrast: true,
        kind: "error",
      });
      closeOverlay();
    }
  };

  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      className={styles.formContainer}
    >
      <Stack gap={4}>
        <Layer>
          <FormLabel className={styles.formLabel}>
            {t("date", "Date")}
          </FormLabel>
          <Controller
            control={control}
            name="startDatetime"
            render={({ field: { onChange, value } }) => (
              <OpenmrsDatePicker
                value={value}
                id="startDatetime"
                labelText={t("startDatetime", "Start Datetime")}
                onChange={onChange}
                invalid={!!errors.startDatetime}
                invalidText={errors.startDatetime?.message}
              />
            )}
          />
        </Layer>
        <Layer>
          <Controller
            control={control}
            name="endDatetime"
            render={({ field: { onChange, value } }) => (
              <OpenmrsDatePicker
                value={value}
                id="endDatetime"
                labelText={t("endDatetime", "End Datetime")}
                onChange={onChange}
                invalid={!!errors.endDatetime}
                invalidText={errors.endDatetime?.message}
              />
            )}
          />
        </Layer>
        <Layer>
          <FormLabel className={styles.formLabel}>
            {t("procedureOutcome", "Procedure outcome")}
          </FormLabel>
          <Controller
            control={control}
            name="outcome"
            render={({ field: { onChange } }) => (
              <ComboBox
                onChange={({ selectedItem }) => onChange(selectedItem.id)}
                id="outcome"
                items={[
                  { id: "SUCCESSFUL", text: t("successful", "Successful") },
                  {
                    id: "PARTIALLY_SUCCESSFUL",
                    text: t("partiallySuccessful", "Partially success"),
                  },
                  {
                    id: "NOT_SUCCESSFUL",
                    text: t("notSuccessfully", "Not successful"),
                  },
                ]}
                itemToString={(item) => (item ? item.text : "")}
                titleText={t("outcome", "Outcome")}
                placeholder={t("selectOutcome", "Select outcome")}
                invalid={!!errors.outcome}
                invalidText={errors.outcome?.message}
              />
            )}
          />
        </Layer>
        <Layer>
          <FormLabel className={styles.formLabel}>
            {t("procedureReport", "Procedure report")}
          </FormLabel>
          <Controller
            control={control}
            name="procedureReport"
            render={({ field: { onChange } }) => (
              <TextArea
                id="procedureReport"
                labelText={t("procedureReport", "Procedure report")}
                rows={4}
                onChange={onChange}
                placeholder={t(
                  "procedureReportPlaceholder",
                  "Enter procedure report"
                )}
                invalid={!!errors.procedureReport}
                invalidText={errors.procedureReport?.message}
              />
            )}
          />
        </Layer>
        <Layer>
          <FormLabel className={styles.formLabel}>
            {t("participants", "Participants")}
          </FormLabel>
          <div>
            <Controller
              name="participants"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Search
                  autoFocus
                  size="md"
                  id="conditionsSearch"
                  labelText={t("enterParticipants", "Enter participants")}
                  placeholder={t("searchParticipants", "Search participants")}
                  onChange={(e) => {
                    onChange(e);
                    handleProviderSearchTermChange(e);
                  }}
                  onClear={() => {
                    setProviderSearchTerm("");
                    setSelectedProvider(null);
                  }}
                  value={(() => {
                    if (selectedProvider) {
                      return selectedProvider.display;
                    }
                    if (debouncedProviderSearchTerm) {
                      return value;
                    }
                  })()}
                />
              )}
            />
            {(() => {
              if (!debouncedProviderSearchTerm || selectedProvider) return null;
              if (isProviderSearching)
                return (
                  <InlineLoading
                    className={styles.loader}
                    description={t("searching", "Searching") + "..."}
                  />
                );
              if (providerSearchResults && providerSearchResults.length) {
                return (
                  <ul className={styles.conditionsList}>
                    {providerSearchResults?.map((searchResult) => (
                      <li
                        role="menuitem"
                        className={styles.condition}
                        key={searchResult?.concept?.uuid}
                        onClick={() => handleProviderChange(searchResult)}
                      >
                        {searchResult.display}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <Layer>
                  <Tile className={styles.emptyResults}>
                    <span>
                      {t("noResultsFor", "No results for")}{" "}
                      <strong>"{debouncedProviderSearchTerm}"</strong>
                    </span>
                  </Tile>
                </Layer>
              );
            })()}
          </div>
        </Layer>
        <Layer>
          <FormLabel className={styles.formLabel}>
            {t("complications", "Complications")}
          </FormLabel>
          <div>
            <Controller
              name="complications"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Search
                  autoFocus
                  size="md"
                  id="conditionsSearch"
                  labelText={t("enterCondition", "Enter condition")}
                  placeholder={t("searchConditions", "Search conditions")}
                  onChange={(e) => {
                    onChange(e);
                    handleSearchTermChange(e);
                  }}
                  onClear={() => {
                    setSearchTerm("");
                    setSelectedCondition(null);
                  }}
                  value={(() => {
                    if (selectedCondition) {
                      return selectedCondition.display;
                    }
                    if (debouncedSearchTerm) {
                      return value;
                    }
                  })()}
                />
              )}
            />
            {(() => {
              if (!debouncedSearchTerm || selectedCondition) return null;
              if (isSearching)
                return (
                  <InlineLoading
                    className={styles.loader}
                    description={t("searching", "Searching") + "..."}
                  />
                );
              if (searchResults && searchResults.length) {
                return (
                  <ul className={styles.conditionsList}>
                    {searchResults?.map((searchResult) => (
                      <li
                        role="menuitem"
                        className={styles.condition}
                        key={searchResult?.concept?.uuid}
                        onClick={() => handleConditionChange(searchResult)}
                      >
                        {searchResult.display}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <Layer>
                  <Tile className={styles.emptyResults}>
                    <span>
                      {t("noResultsFor", "No results for")}{" "}
                      <strong>"{debouncedSearchTerm}"</strong>
                    </span>
                  </Tile>
                </Layer>
              );
            })()}
          </div>
        </Layer>
      </Stack>
      <ButtonSet className={styles.buttonSetContainer}>
        <Button size="lg" kind="secondary">
          {t("discard", "Discard")}
        </Button>
        <Button type="submit" size="lg" kind="primary">
          {t("saveAndClose", "Save & Close")}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default PostProcedureForm;
