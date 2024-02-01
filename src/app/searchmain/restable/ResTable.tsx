import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function ResTable({ cols, tabdata }: tabparam) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tabdata}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

type tabparam = {
  cols: any;
  tabdata: any;
};
// export default function ResTable({ cols, tabdata }: tabparam) {
