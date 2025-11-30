import { initPlugin } from "@c3framework/core";
import Config from "./addon";
import Instance from "./instance";

initPlugin(global.C3, Config, { Instance });
