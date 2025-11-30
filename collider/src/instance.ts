import { AceClass, Plugin } from "@c3framework/core";
import Config from "./addon";

@AceClass()
class Instance extends Plugin.Instance(Config, globalThis.ISDKWorldInstanceBase) {
  constructor() {
    super();
  }
}

export default Instance;
