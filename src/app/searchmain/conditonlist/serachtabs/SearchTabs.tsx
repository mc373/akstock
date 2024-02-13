"use client";
import React from "react";
import { getdata } from "@/apis/getdb";
import {
  getJsonGrpArr,
  getArrDistinct,
  chkJsonValArr,
  isNull,
} from "@/utils/tools/tools";
import Cookies from "react-cookie";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

import Checkbox from "@mui/material/Checkbox";

import ResTable from "@/app/searchmain/restable/ResTable";
import StkTable from "../../restable/StkTable";
import { toolbarClasses } from "@mui/material";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
type dataFilter = {
  colid: string;
  operType: string;
  v1: string;
  v2: string;
};
let filterArry: [dataFilter] = [
  {
    colid: "",
    operType: "",
    v1: "",
    v2: "",
  },
];
export type HeadItem = {
  colid: string;
  colgrpid: string;
  colname: string;
  grpname: string;
  idxseq: string;
};

export type HeadArr = [HeadItem];
const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: "20px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "8px",
          marginLeft: "10px",
        },
      },
    },
  },
});
let orgStkData: any = [];
let usercols: any[] = iniUsercols();
let t = 0;
function iniUsercols() {
  try {
    const item = localStorage.getItem("usercols");

    // usercols = item;
    return item ? JSON.parse(item) : "";
  } catch (error) {
    const item = [
      { field: "ts_code", headerName: "股票代码", width: 120 },
      { field: "stockname", headerName: "股票名称", width: 130 },
    ];
    // usercols = item;
    return item;
  }
}

function SetTabsHead(rowdata: any[]) {
  const grpArr = getArrDistinct(rowdata, "colgrpid");
  return grpArr.map((row, Index) => (
    <Tab label={row["grpname"]} {...a11yProps(Index)} key={row["colgrpid"]} />
  ));
}
const SearchTabs = () => {
  const [data, setData] = React.useState([
    {
      colid: "",
      colgrpid: "",
      colname: "",
      grpname: "",
      idxseq: "",
      coltype: "",
      colunit: "",
    },
  ]);

  const [stkdata, setStkData] = React.useState([]);
  const [columns, setColumns] = React.useState<any[]>(usercols);
  React.useEffect(() => {
    getdata({ type: "sqldata", paraStr1: "stk_sql002" }).then((data) => {
      setData(data);
    });
    getdata({ type: "sqldata", paraStr1: "stk_sql001" }).then((data) => {
      orgStkData = data;
      setStkData(data);
    });
  }, []);
  //tab的标签
  function SetTabsContent(grpid: string, columns: any[]) {
    const itemArr = getJsonGrpArr(data, "colgrpid", grpid);

    let timeoutCt = setTimeout(() => {
      const v_ret = [];
    }, 1);
    const handleItemChange = (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const fld = event.target.getAttribute("data-colid")!;
      const coltype = event.target.getAttribute("data-coltype")!;
      const v1 = event.target.value;
      // const chkhead = fld.substring(0, 4);
      // const tofld = fld.substring(4);

      clearTimeout(timeoutCt); //先清掉已有的timeout
      //创建执行新的timeout
      timeoutCt = setTimeout(() => {
        //先删掉当前的条件
        for (let i = 0; i < filterArry.length; i++) {
          if (filterArry[i]["colid"] === fld) {
            filterArry.splice(i, 1);
          }
        }

        let resData = orgStkData;

        if (v1 != "") {
          filterArry.push({
            colid: fld,
            operType: coltype,
            v1: event.target.value,
            v2: "",
          });
        }
        for (let i = 1; i < filterArry.length; i++) {
          resData = resData.filter(function (e: any) {
            if (coltype === "str") {
              let tmpv1 = filterArry[i].v1;
              let tmpcolidval = e[filterArry[i].colid];
              if (filterArry[i].colid === "ts_code") {
                tmpcolidval = e["codeindex"];
              }
              return new RegExp(tmpv1.toUpperCase()).test(tmpcolidval);
            } else if (coltype === "nr") {
              if (filterArry[i].colid.substring(0, 4) === "to__") {
                return e[filterArry[i].colid.substring(4)] <= filterArry[i].v1;
              } else {
                return e[filterArry[i].colid] >= filterArry[i].v1;
              }
            }
          });
        }

        setStkData(resData);
      }, 500);
    };
    const headerHandleChk = (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = event.target.id;

      const chked = event.target.checked;
      const colname = event.target.getAttribute("data-colname")!;
      let cols = [];
      let addnew = "Y";
      for (let i = 0; i < columns.length; i++) {
        if (chked === true) {
          cols.push(columns[i]);
          if (id === columns[i].field) {
            addnew = "N";
          }
        } else if (chked === false) {
          if (id === columns[i].field) {
          } else {
            cols.push(columns[i]);
          }
        }
      }
      if (chked === true && addnew === "Y") {
        cols.push({
          field: id,
          headerName: colname,
          width: 120,
        });
      }
      localStorage.setItem("usercols", JSON.stringify(cols));
      console.log(cols);
      setColumns(cols);
    };
    function getSearchItem(row: any) {
      if (row["coltype"] === "str") {
        return (
          <Input
            id={row["colid"]}
            inputProps={{
              "data-colid": row["colid"],
              "data-coltype": row["coltype"], // <------- add data attribute like this
            }}
            name={row["colid"]}
            onChange={handleItemChange}
          />
        );
      } else if (row["coltype"] === "nr") {
        return (
          <div>
            <Input
              id={row["colid"]}
              inputProps={{
                "data-colid": row["colid"],
                "data-coltype": row["coltype"], // <------- add data attribute like this
              }}
              name={row["colid"]}
              onChange={handleItemChange}
              sx={{ width: "60px" }}
            />
            <Input
              id={"to__" + row["colid"]}
              inputProps={{
                "data-colid": "to__" + row["colid"],
                "data-coltype": row["coltype"], // <------- add data attribute like this
              }}
              sx={{ width: "60px" }}
              name={"to__" + row["colid"]}
              onChange={handleItemChange}
            />
          </div>
        );
      }
    }
    function ischk(row: any, columns: any[]) {
      if (
        row["ischecked"] === "Y" ||
        chkJsonValArr(usercols, "field", row["colid"]).length > 0
      ) {
        return true;
      } else {
        return false;
      }
      // for (let i = 0; i < columns.length; i++) {
      //   if (row["colid"] === columns[i].field) {
      //     return true;
      //   }
      // }
      // if (chkJsonValArr(columns, "field", row["colid"]).length > 0) {
      //   return true;
      // }
    }

    //tab的项
    return itemArr.map((row, Index) => (
      <Box key={row["colid"]}>
        <ThemeProvider theme={theme}>
          <Grid>
            <Item>
              <Box sx={{ textAlign: "left" }}>
                <Checkbox
                  id={row["colid"]}
                  sx={{ padding: 0, marginRight: "4px", top: "-1px" }}
                  size="small"
                  defaultChecked={ischk(row, columns)}
                  // checked={ischk(row, columns)}
                  disabled={row["isenable"] === "Y" ? false : true}
                  inputProps={
                    {
                      "data-colid": row["colid"],
                      "data-colname": row["colname"],
                      "data-coltype": row["coltype"], // <------- add data attribute like this
                    } as any // <------- when no as any will cause error
                  }
                  onChange={headerHandleChk}
                />
                {row["colname"]}
              </Box>

              <Box sx={{ display: "inline-flex" }}>{getSearchItem(row)}</Box>
            </Item>
          </Grid>
        </ThemeProvider>
      </Box>
    ));
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {SetTabsHead(data)}
          </Tabs>
        </Box>
        {getArrDistinct(data, "colgrpid").map((row, Index) => (
          <Box
            key={Index}
            display={value == Index ? "block" : "none"}
            sx={{ flexGrow: 1 }}
          >
            <Grid container spacing={1}>
              {SetTabsContent(row["colgrpid"], columns)}
            </Grid>
          </Box>
        ))}
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        {/* <StkTable cols={columns} tabdata={stkdata} /> */}
      </div>
    </>
  );
};

export default SearchTabs;
