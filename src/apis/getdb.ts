// export type FetParams = { type: string; tk?: string; fetchtype?: string };
export type FetParams = { type: string; paraStr1?: string };
export const getdata = (params: FetParams) => {
  //ptype: string, tk?: string

  let url = "";
  if (params.type === "sqldata") {
    url =
      "http://h2995414.stratoserver.net:8080/sqldata?sqlid=" +
      params.paraStr1 +
      "";
  } else {
    url = "http://h2995414.stratoserver.net:8080/" + params.type;
  }
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return Promise.resolve(res);
    });
};
type ParamItem = { paramid: string; paramval: string };
export type PostParams = { sqlid: string; paraArr: [ParamItem] };
export const postdata = (params: PostParams) => {
  //http://h2995414.stratoserver.net:8080/sqldata
  //h2995414.stratoserver.net
  //localhost:8080

  return fetch("http://h2995414.stratoserver.net:8080/sqldata", {
    method: "post",
    body: JSON.stringify({
      sqlid: params.sqlid,
      paramarr: params.paraArr,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return Promise.resolve(res);
    });
};
