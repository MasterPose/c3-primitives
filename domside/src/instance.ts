import { AceClass, Action, Behavior, Condition, Expression, Param, Plugin, Trigger } from "@c3framework/core";
import Config from "./addon";
import { dot } from "./utils/dot";
import { DomSideEventBus } from "./utils/eventBus";
import type IDomSideType from "./type";

const DOM_ID = 'MasterPose_DomSide:DOM_Handler';


@AceClass()
class IDomSideInstance extends Plugin.Instance(Config, globalThis.ISDKInstanceBase) {
  _lastMessageId: DomSideMessageId;
  _lastMessageValue: DomSideMessageValue;
  _lastInvoke: string;
  _invokeWasFound: boolean;
  _invokeReturnData?: JSONValue;

  _bus: DomSideEventBus;

  constructor() {
    super({ domComponentId: DOM_ID });

    (this.objectType as unknown as IDomSideType)._registerSingleton(this);

    this._bus = new DomSideEventBus();

    this._lastMessageId = '';
    this._lastMessageValue = '';
    this._lastInvoke = '';
    this._invokeWasFound = false;

    this._addDOMMessageHandler('SendEvent', (e) => {
      const data = e as DomSideMessage;
      this.#onSendEvent(data[0], data[1]);
    });

    this._addDOMMessageHandler('InvokeProcedure', (e) => {
      const data = e as DomSideMessage;
      return this.#onInvokeProcedure(data[0], data[1]);
    });
  }

  @Action()
  async importFile(
    @Param({
      // @ts-ignore
      filter: ".js"
    })
    file: projectfile
  ) {
    if (!file.endsWith('.js')) {
      let msg: string;

      if (file.endsWith('.ts')) {
        msg = "[DomSide]: You can't import TypeScript files, try JavaScript instead";
      } else {
        msg = "[DomSide]: Tried to import non .js file";
      }

      if (this.runtime.platformInfo.exportType === 'preview') alert(msg);

      throw new Error(msg);
    }

    return await this._postToDOMAsync('ImportScript', file);
  }

  @Action({
    listName: 'Send Event',
    category: 'callDomSide',
  })
  send(
    tag: string,
    data: any,
  ) {
    this._postToDOM('SendEvent', [data, tag] as DomSideMessage);
  }

  @Action({
    category: 'callDomSide',
  })
  async invoke(
    tag: string,
    data: any,
  ): Promise<DomSideMessageValue> {
    return await this._postToDOMAsync('InvokeProcedure', [data, tag] as DomSideMessage).then((e) => {
      const message = e as DomSideMessageValue;

      const value = this._lastMessageValue = message;
      this._lastMessageId = tag;
      this.trigger(this.onInvokeCallback);

      return value;
    });
  }

  @Trigger({
    displayText: "On Invoke {0} Callback",
    category: 'callDomSideResponse',
  })
  onInvokeCallback(
    tag: string
  ) {
    return tag === this._lastMessageId;
  }

  @Action({
    category: 'handleDomSide',
  })
  setReturnValue(
    value: any
  ) {
    this._invokeReturnData = value;
  }

  @Trigger({
    listName: "On Handle",
    displayText: "On Handle {0}",
    category: 'handleDomSide'
  })
  onHandle(
    tag: string
  ) {
    if (this._invokeWasFound) return false;

    return this._invokeWasFound = tag === this._lastInvoke;
  }

  @Trigger({
    displayText: "On Event {0}",
    category: 'handleDomSide'
  })
  onEvent(
    tag: string
  ) {
    return tag === this._lastMessageId;
  }

  @Trigger({
    category: 'handleDomSide'
  })
  onAnyEvent() {
    return true;
  }

  @Expression({
    category: 'callDomSideResponse'
  })
  message(): any {
    return this._lastMessageValue;
  }

  @Expression({
    category: 'callDomSideResponse'
  })
  messageTag(): string {
    return this._lastMessageId;
  }

  @Expression({
    category: 'callDomSideResponse'
  })
  fromMessage(
    path: string
  ): any {
    return dot(path, this._lastMessageValue) ?? '';
  }

  @Expression({
    category: 'callDomSideResponse'
  })
  messageAsJSON() {
    return this._lastMessageValue ? JSON.stringify(this._lastMessageValue) : '';
  }

  #onSendEvent(data: JSONValue, id: string) {
    try {
      this._bus.getEventHandler(id).forEach((callback) => {
        callback(data, id);
      });
    } catch (error) {
      console.error(error);
    }

    this._lastMessageValue = data;
    this._lastMessageId = id;

    this.trigger(this.onEvent);

    try {
      this._bus.getAnyEventHandlers().forEach((callback) => {
        callback(data, id);
      });
    } catch (error) {
      console.error(error);
    }

    this._lastMessageValue = data;
    this._lastMessageId = id;

    this.trigger(this.onAnyEvent);
  }

  async #onInvokeProcedure(data: JSONValue, id: string): Promise<DomSideMessageValue> {
    const callback = this._bus.getInvokeHandlers().get(id);

    if (!callback) {
      this._invokeReturnData = undefined;
      this._lastInvoke = id;
      this.trigger(this.onHandle);

      if (!this._invokeWasFound && this._invokeReturnData === undefined) {
        console.warn(`[DomSide]: Invoking undefined procedure '${id}' from WebWorker`);
        return '';
      }

      this._invokeWasFound = false;
      return this._invokeReturnData as unknown as JSONValue;
    };

    const result = await callback(data, id);

    return result;
  }
}

export default IDomSideInstance;
