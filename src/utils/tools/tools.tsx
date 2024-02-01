import React from "react";
import { useState } from "react";
import { useEffect } from "react";
//javascript中的!!是逻辑"非非"，即是在逻辑“非”的基础上再"非"一次。通过!或!!可以将很多类型转换成bool类型
//排除value为0的情况
//export const isFalsy = (value) => value===0?true:!!value;
export const isFalsy = (value: any) => (value === 0 ? false : !value);
//在一个函数里改变一个传入的对象是不好的
// export const cleanObject = (object: object) => {
//   // Object.assign({},object) 等价于下面
//   //便利objcet 如果key是0就删除掉
//   const result = { ...object };
//   Object.keys(result).forEach((key) => {
//     // @ts-ignore
//     const value = result[key];
//     let chk = isFalsy(value);
//     if (chk) {
//       // @ts-ignore
//       delete result[key];
//     }
//   });

//   return result;
// };
//customer hook 必须以use开头，否则eslint不认为是个hook
//customer hook只有函数内部使用hook时才 才使用 customer hook
//执行一次性函数
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

//useDebounce 利用setTimeout只执行最后一个的setTimeout函数，之前的都会被清除
//？ ts表示可传可不传
//<V>泛型
export const useDebounce = <V,>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    //每次在value变化以后，设定一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    //return后的函数 每次在上一个useEffect处理完以后再执行，做一些清理工作
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]); //在vaLue或delay变化的时候

  return debouncedValue;
};

export const isNull = <T,>(x: T): boolean => {
  return x === null || x === undefined || String(x).length === 0;
};

//延缓执行函数 delayExc
//timeout计数器初始化
let timeoutCt = setTimeout(() => {
  const v_ret = [];
}, 1);
export function delayExc<V>(
  value: V, //泛型参数
  callback: (param: V) => void, //对传进来的参数进行回调
  delay?: number //延迟执行秒数
) {
  clearTimeout(timeoutCt); //先清掉已有的timeout
  //创建执行新的timeout
  timeoutCt = setTimeout(() => {
    callback(value); //执行回调
  }, delay);
}

export function chkJsonValArr(p_json: any[], p_key: any, p_val: any): any[] {
  const v_ret = []; //默认值不存在
  for (let i = 0; i < p_json.length; i++) {
    JSON.stringify(p_json);

    if (p_json[i][p_key] === p_val) {
      v_ret.push(p_json[i]);
    }
  }
  return v_ret;
}
/*
 * @description		根据某个字段实现对json数组的排序
 * @param	 array	要排序的json数组对象
 * @param	 field	排序字段（此参数必须为字符串）
 * @param	 reverse  是否倒序（默认为false）
 * @return	array	返回排序后的json数组
 */
export function jsonSort(array: any[], field: string, reverse?: boolean) {
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据

  if (array.length < 2 || !field || typeof array[0] !== "object") return array;
  //数字类型排序

  if (typeof array[0][field] === "number") {
    array.sort(function (x, y) {
      return x[field] - y[field];
    });
  }
  //字符串类型排序
  if (typeof array[0][field] === "string") {
    array.sort(function (x, y) {
      return x[field].localeCompare(y[field]);
    });
  }
  //倒序

  //array.sort(function(x, y) { return parseFloat(x[field]) - parseFloat(y[field])});
  if (reverse) {
    array.reverse();
  }
  return array;
}
//对jsonarray的中jsonObj的属性的子属性进行排序
export function jsonPropSort(
  array: any[],
  prop: string,
  field: string,
  reverse?: boolean
) {
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
  if (array.length < 2 || !field || typeof array[0] !== "object") return array;
  //数字类型排序
  if (typeof array[0][prop][field] === "number") {
    array.sort(function (x, y) {
      return x[prop][field] - y[prop][field];
    });
  }
  //字符串类型排序
  if (typeof array[0][prop][field] === "string") {
    array.sort(function (x, y) {
      return x[prop][field].localeCompare(y[prop][field]);
    });
  }
  /*
             if(typeof array[0][prop][field] === "float") {
             array.sort(function(x, y) { return parseFloat(x[prop][field]) - parseFloat(y[prop][field])});
             }
             */
  //倒序
  if (reverse) {
    array.reverse();
  }
  return array;
}

export function delJson(p_json: any[], p_key: string, p_val: string) {
  const vJson = [];
  // var v_ret = "N"; //默认值不存在
  for (let i = 0; i < p_json.length; i++) {
    if (p_json[i][p_key] != p_val) {
      vJson.push(p_json[i]);
    }
  }
  return vJson;
}
export function getJsonGrpArr(p_json: any[], p_key: string, p_val: string) {
  const vJson = [];

  for (let i = 0; i < p_json.length; i++) {
    if (p_json[i][p_key] === p_val) {
      vJson.push(p_json[i]);
    }
  }

  return vJson;
}
export function getArrDistinct(p_json: any[], p_key: string) {
  const vJson = [];
  let tmpsTr = "";
  for (let i = 0; i < p_json.length; i++) {
    if (p_json[i][p_key] != tmpsTr) {
      vJson.push(p_json[i]);
    }
    tmpsTr = p_json[i][p_key];
  }
  return vJson;
}
export function pushJson(p_json: any[], inObj: {}) {
  const vJson = [];

  for (let i = 0; i < p_json.length; i++) {
    vJson.push(p_json[i]);
  }
  vJson.push(inObj);
  return vJson;
}
export function getWinSize(): string {
  let ret = "";
  if (window.innerWidth > 1080) {
    ret = "3";
  } else if (window.innerWidth > 778 && window.innerWidth <= 1080) {
    ret = "2";
  } else {
    ret = "1";
  }
  return ret;
}
