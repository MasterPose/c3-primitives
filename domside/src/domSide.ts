import { DomSideEventBus } from "./utils/eventBus";

const DOM_ID = 'MasterPose_DomSide:DOM_Handler';


const HANDLER_CLASS = class DomSideHandler extends globalThis.DOMHandler {
  _bus: DomSideEventBus;
  static _singleton: DomSideHandler;

  constructor(iRuntime: IRuntimeInterface) {
    super(iRuntime, DOM_ID);

    this._bus = new DomSideEventBus();
    DomSideHandler._singleton = this;

    this.AddRuntimeMessageHandler('SendEvent', (e) => {
      const data = e as DomSideMessage;
      this.#onSendEvent(data[0], data[1]);
    });

    this.AddRuntimeMessageHandler('InvokeProcedure', (e) => {
      const data = e as DomSideMessage;
      return this.#onInvokeProcedure(data[0], data[1]);
    });

    this.AddRuntimeMessageHandler('ImportScript', async (e) => {
      const path = e as string;
      const file = new URL(path, location.href).toString();

      await import(file);

      return true;
    });
  }

  //#region PUBLIC_API

  static send(id: string, data: DomSideMessageValue): void {
    this._singleton.PostToRuntime('SendEvent', [data, id] as DomSideMessage);
  }

  static async invoke(id: string, data: DomSideMessageValue): Promise<DomSideMessageValue> {
    return await this._singleton.PostToRuntimeAsync('InvokeProcedure', [data, id] as DomSideMessage);
  }

  static on(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    this._singleton._bus.on(id, callback);
  }

  static once(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    this._singleton._bus.once(id, callback);
  }

  static off(id: DomSideMessageId, callback: DomSideMessageCallback): boolean {
    return this._singleton._bus.off(id, callback);
  }

  static any(callback: DomSideMessageCallback): void {
    this._singleton._bus.any(callback);
  }

  static handle(id: DomSideMessageId, callback: DomSideInvokeCallback) {
    this._singleton._bus.handle(id, callback);
  }

  static handleOnce(id: DomSideMessageId, callback: DomSideInvokeCallback): void {
    this._singleton._bus.handleOnce(id, callback);
  }

  static removeHandler(id: DomSideMessageId): boolean {
    return this._singleton._bus.removeHandler(id);
  }

  //#endregion

  //#region INSTANCE

  #onSendEvent(data: JSONValue, id: string) {
    this._bus.getEventHandler(id).forEach((callback) => {
      callback(data, id);
    });
    this._bus.getAnyEventHandlers().forEach((callback) => {
      callback(data, id);
    });
  }

  async #onInvokeProcedure(data: JSONValue, id: string): Promise<DomSideMessageValue> {
    const callback = this._bus.getInvokeHandlers().get(id);

    if (!callback) {
      console.warn(`[DomSide]: Invoking undefined procedure '${id}' from DOM`);
      return '';
    };

    const result = await callback(data, id);

    return result;
  }


  //#endregion
}

globalThis.DomSideHandler = HANDLER_CLASS;

globalThis.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
