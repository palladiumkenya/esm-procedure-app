import React, { useCallback, useState } from "react";
import {
  OpenmrsDatePicker,
  showSnackbar,
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
  useProviders,
} from "./post-procedure.resource";
import { CodedCondition, ProcedurePayload } from "../../types";
import { Result } from "../../work-list/work-list.resource";
import dayjs from "dayjs";

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
  complications: z.string({ required_error: "Complications are required" }),
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
  const { providers } = useProviders();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { searchResults, isSearching } =
    useConditionsSearch(debouncedSearchTerm);
  const [selectedCondition, setSelectedCondition] =
    useState<CodedCondition>(null);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<PostProcedureFormSchema>({
    defaultValues: {},
    resolver: zodResolver(validationSchema),
  });

  const handleConditionChange = useCallback(
    (selectedCondition: CodedCondition) => {
      setSelectedCondition(selectedCondition);
    },
    []
  );

  const onSubmit = async (data: PostProcedureFormSchema) => {
    const payload: ProcedurePayload = {
      patient: patientUuid,
      procedureOrder: procedure.uuid,
      concept: procedure.concept.uuid,
      procedureReason: procedure.orderReason?.uuid,
      category: procedure.orderType?.uuid,
      bodySite: procedure?.specimenSource?.uuid,
      status: "COMPLETED",
      outcome: data.outcome,
      location: sessionLocation?.uuid,
      startDatetime: dayjs(data.startDatetime).format("YYYY-MM-DDTHH:mm:ssZ"),
      endDatetime: dayjs(data.endDatetime).format("YYYY-MM-DDTHH:mm:ssZ"),
      procedureReport: data.procedureReport,
      complications: [
        {
          condition: {
            coded: selectedCondition.concept.uuid,
          },
          patient: patientUuid,
          clinicalStatus: "ACTIVE",
          verificationStatus: "CONFIRMED",
          onsetDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
          additionalDetail: "",
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
    } catch (error) {
      console.error(error);
      showSnackbar({
        title: t("error", "Error"),
        subtitle: t("errorSavingProcedure", "Error saving procedure"),
        timeoutInMs: 5000,
        isLowContrast: true,
        kind: "error",
      });
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
                  {
                    id: "PARTIALLY_SUCCESSFUL",
                    text: t("partiallySuccessful", "Partially success"),
                  },
                  {
                    id: "NOT_SUCCESSFUL",
                    text: t("notSuccessfully", "Not successful"),
                  },
                  { id: "SUCCESSFUL", text: t("successful", "Successful") },
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
          <Controller
            control={control}
            name="participants"
            render={({ field: { onChange } }) => (
              <MultiSelect
                id="participants"
                titleText={t("participants", "Participants")}
                label={t("selectParticipants", "Select participants")}
                items={providers}
                onChange={({ selectedItems }) => onChange(selectedItems)}
                itemToString={(item) => (item ? item.display : "")}
                selectionFeedback="top-after-reopen"
                placeholder={t("selectParticipants", "Select participants")}
                invalid={!!errors.participants}
                invalidText={errors.participants?.message}
              />
            )}
          />
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
