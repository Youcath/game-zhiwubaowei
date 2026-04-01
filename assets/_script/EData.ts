/** 配表总容器（原 EData.js 默认导出） */

export class EData {
  version = 0;
  createTime = '';
  databox: Record<string, unknown> = {};
  datapara: Record<string, { num?: number }> = {};
  datasuperplant: Record<string, unknown> = {};
  datalevel: Record<string, unknown> = {};
  datamonster: Record<string, unknown> = {};
  datastage: Record<string, unknown> = {};
  datastagereward: Record<string, unknown> = {};
  dataad: Record<string, unknown> = {};
  dataskill: Record<string, unknown> = {};
  datashopbox: Record<string, unknown> = {};
  databuygold: Record<string, unknown> = {};
  datadailyshop: Record<string, unknown> = {};
  dataatt: Record<string, unknown> = {};
  dataitem: Record<string, unknown> = {};
  datagameguid: Record<string, unknown> = {};
  dataplant: Record<string, unknown> = {};
  datastage1: Record<string, unknown> = {};
  datastage2: Record<string, unknown> = {};
  datastage3: Record<string, unknown> = {};
  datastage4: Record<string, unknown> = {};
  datastage5: Record<string, unknown> = {};
  datastage6: Record<string, unknown> = {};
  datastage7: Record<string, unknown> = {};
  datarefresh: Record<string, unknown> = {};
  datasettlement: Record<string, unknown> = {};
  data_fixedplant: Record<string, unknown> = {};
  data_bossskill: Record<string, unknown> = {};
  data_specialrefresh: Record<string, unknown> = {};
  dataendlessstage: Record<string, unknown> = {};
  data_bagweapon: Record<string, unknown> = {};
  data_bagstage: Record<string, unknown> = {};
  data_bridgeobstacle: Record<string, unknown> = {};
  data_bridgestage: Record<string, unknown> = {};
  data_weather: Record<string, unknown> = {};
  data_weatherdata: Record<string, unknown> = {};
  data_jarmonster: Record<string, unknown> = {};
  data_jartreasure: Record<string, unknown> = {};
  data_jarstage: Record<string, unknown> = {};
  data_zombieplant: Record<string, unknown> = {};
  data_zombiemonster: Record<string, unknown> = {};
  data_zombiestage: Record<string, unknown> = {};
  data_hybridizationcombine: Record<string, unknown> = {};
  data_hybridizationskill: Record<string, unknown> = {};
  data_hybridizationstarmaster: Record<string, unknown> = {};
  /** 遗物表（RelicsDataProxy.upgradeRelics） */
  data_artifact: Record<string, { needNum: string; maxLevel: number }> = {};
}
