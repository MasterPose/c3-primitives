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

  @Action({
    listName: 'Import script',
    displayText: 'Import {0}',
    description: 'Loads a .js file in the DOM side.',
    highlight: true
  })
  async importScript(
    @Param({
      desc: 'Script file to load in the DOM Side',
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
    listName: 'Send event',
    displayText: 'Send {0}({1})',
    category: 'callDomSide',
    description: 'Sends an event to the DOM Side.',
  })
  send(
    @Param({ desc: "Event name to send." })
    tag: string,
    @Param({ desc: "Data to send attached to the event." })
    data: any,
  ) {
    this._postToDOM('SendEvent', [data, tag] as DomSideMessage);
  }

  @Action({
    listName: 'Invoke',
    displayText: 'Invoke {0}({1})',
    category: 'callDomSide',
    description: "Invokes a procedure call from the DOM Side.",
    highlight: true,
  })
  async invoke(
    @Param({ desc: "DOM Side procedure name to execute." })
    tag: string,
    @Param({ desc: "Data to send with the call." })
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
    listName: 'On invoke response',
    displayText: "On {0} response",
    category: 'callDomSideResponse',
    description: 'Triggers after DOM Side returns a value from an "Invoke" call.',
    highlight: true
  })
  onInvokeCallback(
    @Param({ desc: "Tag of the procedure call name." })
    tag: string
  ) {
    return tag === this._lastMessageId;
  }

  @Action({
    listName: 'Set return value',
    displayText: 'Return {0}',
    description: 'Sets the value to return to the DOM Side from a procedure call. Use this inside the "On handle" trigger.',
    category: 'handleDomSide',
  })
  setReturnValue(
    @Param({ desc: "Value to return to the DOM Side." })
    value: any
  ) {
    this._invokeReturnData = value;
  }

  @Trigger({
    listName: "On handle",
    displayText: "On handle {0}",
    category: 'handleDomSide',
    description: 'Registers a procedure call that the DOM Side can call. [u]You can only register one event for each tag[/u].',
  })
  onHandle(
    @Param({ desc: "Name of the procedure call you want to register." })
    tag: string
  ) {
    if (this._invokeWasFound) return false;

    return this._invokeWasFound = tag === this._lastInvoke;
  }

  @Trigger({
    listName: 'On event',
    displayText: "On event {0}",
    description: 'Triggers when the DOM Side sends an event with the given tag / id.',
    category: 'handleDomSide'
  })
  onEvent(
    @Param({ desc: "Name of the event you want to listen." })
    tag: string
  ) {
    return tag === this._lastMessageId;
  }

  @Trigger({
    listName: 'On any event',
    description: 'Triggers when the DOM Side sends any event',
    category: 'handleDomSide'
  })
  onAnyEvent() {
    return true;
  }

  @Expression({
    description: 'Contains the last relevant IPC message sent. Use this on all the triggers available.',
    category: 'callDomSideResponse'
  })
  message(): any {
    return this._lastMessageValue;
  }

  @Expression({
    description: 'Contains the last relevant IPC message tag/id sent. Use this on all the triggers available.',
    category: 'callDomSideResponse'
  })
  messageTag(): string {
    return this._lastMessageId;
  }

  @Expression({
    description: 'If you sent an object or array message, use a dot notation path to get a value from it.',
    category: 'callDomSideResponse'
  })
  fromMessage(
    @Param({ desc: "The dot-notation path to obtain." })
    path: string
  ): any {
    return dot(path, this._lastMessageValue) ?? '';
  }

  @Expression({
    description: 'Stringifies the last relevant IPC message sent.',
    category: 'callDomSideResponse'
  })
  messageAsJSON() {
    return JSON.stringify(this._lastMessageValue);
  }

  @Expression({
    description: "Gets an human-readable JSON of the last relevant IPC message sent.",
  })
  messageAsBeautifiedJSON(): string {
    return JSON.stringify(this._lastMessageValue, null, 4);
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

    this._lastMessageId = id;
    this._lastMessageValue = data;

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
