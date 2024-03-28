import React from "react";
import { OpenmrsDatePicker } from "@openmrs/esm-framework";
import {
  Form,
  Stack,
  ComboBox,
  TextArea,
  MultiSelect,
  Layer,
  FormLabel,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { ButtonSet } from "@carbon/react";
import { Button } from "@carbon/react";
import styles from "./post-procedure-form.scss";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviders } from "./post-procedure.resource";

type PostProcedureFormProps = {};

const validationSchema = z.object({
  startDatetime: z.string({ required_error: "Start datetime is required" }),
  endDatetime: z.string({ required_error: "End datetime is required" }),
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
  complications: z.array(
    z.string({ required_error: "Complications are required" })
  ),
});

type PostProcedureFormSchema = z.infer<typeof validationSchema>;

const PostProcedureForm: React.FC<PostProcedureFormProps> = () => {
  const { t } = useTranslation();
  const { isLoadingProviders, providers } = useProviders();
  const methods = useForm<PostProcedureFormSchema>({
    defaultValues: {},
    resolver: zodResolver(validationSchema),
  });
  const {
    control,
    formState: { errors },
    getValues,
  } = methods;
  console.log(useWatch({ control, name: "participants" }));
  const onSubmit = (data: PostProcedureFormSchema) => {
    console.log(data);
  };

  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <Form
      onSubmit={methods.handleSubmit(onSubmit, onError)}
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
            name="endDatetime"
            render={({ field: { onChange } }) => (
              <ComboBox
                onChange={onChange}
                id="outcome"
                items={[]}
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
                label={t("participants", "Participants")}
                titleText={t("participants", "Participants")}
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
          <Controller
            control={control}
            name="complications"
            render={({ field: { onChange } }) => (
              <MultiSelect
                id="complications"
                label={t("complications", "Complications")}
                titleText={t("complications", "Complications")}
                placeholder={t("selectComplications", "Select complications")}
                items={[]}
                onChange={({ selectedItems }) => onChange(selectedItems)}
                itemToString={(item) => (item ? item.text : "")}
                selectionFeedback="top-after-reopen"
                invalid={!!errors.complications}
                invalidText={errors.complications?.message}
              />
            )}
          />
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
