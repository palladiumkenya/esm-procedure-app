import React from "react";
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Tile,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./instructions.scss";
import { Result } from "../../work-list/work-list.resource";

interface ProcedureInstructionsModalProps {
  order: Result;
  closeModal: () => void;
}

const ProcedureInstructionsModal: React.FC<ProcedureInstructionsModalProps> = ({
  order,
  closeModal,
}) => {
  const { t } = useTranslation();

  const tableData = [
    { key: "Order Urgency", value: order.priority },
    {
      key: "Schedule date",
      value: order.scheduledDate || new Date().toLocaleDateString(),
    },
    { key: "Body Site", value: order.display },
    { key: "Laterality", value: order.laterality },
    { key: "Number of repeats", value: order.numberOfRepeats },
    { key: "Frequency", value: order.frequency?.display },
  ];

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        title={t("procedureInstructions", "Procedure Order Instructions")}
      />
      <ModalBody>
        <div className={styles.modalBody}>
          <section className={styles.section}>
            <Table size="lg" useZebraStyles={false} aria-label="sample table">
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.key}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <b />
            <Tile>
              <p>
                <b>Instructions</b>
              </p>
              <p className={styles.instructions}>{order.instructions}</p>
            </Tile>
          </section>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t("cancel", "Cancel")}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default ProcedureInstructionsModal;
