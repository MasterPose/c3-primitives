import { initPlugin } from "@c3framework/core";
import Config from "./addon";
import Instance from "./instance";

initPlugin(globalThis.C3, Config, { Instance });
