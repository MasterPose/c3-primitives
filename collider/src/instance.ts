import { AceClass, Condition, Param, Plugin } from "c3-framework";
import Config from "./addon";

@AceClass()
class Instance extends Plugin.Instance(Config, globalThis.ISDKWorldInstanceBase) {
  constructor() {
    super();
  }
}

export default Instance;