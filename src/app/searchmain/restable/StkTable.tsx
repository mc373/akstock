import * as React from "react";
import ReactDOM from "react-dom/client";
import "./StkTable.css";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import Link from "next/link";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}
type tabparam = {
  cols: any[];
  tabdata: any[];
};
let tmptabdata: any[] = [];
let tmpcols: any[] = [];
export default function StkTable({ cols, tabdata }: tabparam) {
  let cnt = 0;
  // { field: "stockname", headerName: "stockname", width: 120 },
  let col: any[] = [];
  cols.map((row, Index) =>
    col.push({
      accessorKey: row["field"],
      header: () => <span>{row["headerName"]}</span>,
    })
  );

  const [columns, setColumns] = React.useState(col);

  const [data, setData] = React.useState(tabdata);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  React.useEffect(() => {
    if (tmptabdata != tabdata) {
      setData(tabdata);
    }

    tmptabdata = tabdata;
  }, [tabdata]);

  React.useEffect(() => {
    if (tmpcols != cols) {
      setColumns(col);
    }
    tmpcols = cols;
  }, [cols]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    // defaultColumn,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  return (
    <div className=" scroll-auto overflow-auto">
      <div className="">
        <table className="">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className=" bg-gray-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap px-4 py-2 text-center    text-lg"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                            className=""
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => {
              cnt++;
              return (
                <tr
                  className={`${
                    cnt % 2 == 0 ? " bg-gray-100" : " "
                  } hover:bg-blue-50`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-4 py-2 text-lg font-medium text-gray-900"
                        // onClick={() => {
                        //   alert(cell.id.slice(-7));
                        // }}
                      >
                        {cell.id.slice(-7) === "ts_code" ? (
                          <Link
                            href={"/StockMain/" + cell.getValue()}
                            className=" underline text-blue-500"
                            target="_blank"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Link>
                        ) : (
                          <div className="  ">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
