import { initPlugin } from "@c3framework/core";
import Config from "./addon";
import IDomSideInstance from "./instance";
import IDomSideType from "./type";

initPlugin(globalThis.C3, Config, {
  Instance: IDomSideInstance,
  Type: IDomSideType,
});
