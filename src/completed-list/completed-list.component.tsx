import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTable,
  DataTableSkeleton,
  Pagination,
  OverflowMenu,
  OverflowMenuItem,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from "@carbon/react";
import { useOrdersWorklist } from "../hooks/useOrdersWorklist";
import { formatDate, parseDate, usePagination } from "@openmrs/esm-framework";
import { useSearchResults } from "../hooks/useSearchResults";
import { Result } from "../work-list/work-list.resource";

interface CompletedListProps {
  fulfillerStatus: string;
}

export const CompletedList: React.FC<CompletedListProps> = ({
  fulfillerStatus,
}) => {
  const { t } = useTranslation();
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const { workListEntries, isLoading } = useOrdersWorklist("", "");
  const [searchString, setSearchString] = useState<string>("");

  const searchResults = useSearchResults(workListEntries, searchString);

  const {
    goTo,
    results: paginatedResults,
    currentPage,
  } = usePagination(searchResults, currentPageSize);

  const pageSizes = [10, 20, 30, 40, 50];
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return paginatedResults
      ?.filter((item) => item.action === "COMPLETED")
      .map((entry) => ({
        ...entry,
        //TODO: add action items here
        actions: (
          <OverflowMenu flipped={true}>
            <OverflowMenuItem
              itemText="Pick Order"
              onClick={() => "Pick Order"}
            />
            <OverflowMenuItem
              itemText="Rejected Order"
              onClick={() => "Rejected Order"}
            />
          </OverflowMenu>
        ),
      }));
  }, [paginatedResults]);

  const tableColumns = [
    { id: 0, header: t("date", "Date"), key: "date" },
    { id: 1, header: t("orderNumber", "Procedure Number"), key: "orderNumber" },
    { id: 2, header: t("procedure", "Procedure"), key: "procedure" },
    { id: 3, header: t("patient", "Patient"), key: "patient" },
    { id: 4, header: t("priority", "Priority"), key: "urgency" },
    { id: 5, header: t("orderer", "Orderer"), key: "orderer" },
  ];

  return isLoading ? (
    <DataTableSkeleton />
  ) : (
    <div>
      <DataTable
        rows={rows}
        headers={tableColumns}
        useZebraStyles
        overflowMenuOnHover={true}
      >
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <>
            <TableContainer>
              <TableToolbar
                style={{
                  position: "static",
                  height: "3rem",
                  overflow: "visible",
                  margin: 0,
                  // TODO: add background color to the toolbar
                }}
              >
                <TableToolbarContent style={{ margin: 0 }}>
                  <TableToolbarSearch
                    style={{ backgroundColor: "#f4f4f4" }}
                    onChange={(event) => setSearchString(event.target.value)}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                      {expandedRows.has(row.id) && (
                        <TableRow>
                          <TableCell
                            colSpan={tableColumns.length + 1}
                          ></TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={workListEntries?.length}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setCurrentPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              />
            </TableContainer>
          </>
        )}
      </DataTable>
    </div>
  );
};
