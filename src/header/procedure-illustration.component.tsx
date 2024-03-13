import React from "react";
import { WatsonHealthScalpelSelect } from "@carbon/react/icons";
import styles from "./procedure-header.scss";

const ProcedureIllustration: React.FC = () => {
  return (
    <div className={styles.svgContainer}>
      <WatsonHealthScalpelSelect className={styles.iconOverrides} />
    </div>
  );
};

export default ProcedureIllustration;
