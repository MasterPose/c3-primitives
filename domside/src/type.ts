import type IDomSideInstance from "./instance";

class IDomSideType extends globalThis.ISDKObjectTypeBase<IDomSideInstance> implements IDomSideHandler {
  _singleton!: IDomSideInstance;

  constructor() {
    super();
  }

  send(id: string, data: DomSideMessageValue): void {
    this._singleton.send(id, data);
  }

  async invoke(id: string, data: DomSideMessageValue): Promise<DomSideMessageValue> {
    return await this._singleton.invoke(id, data);
  }

  on(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    this._singleton._bus.on(id, callback);
  }

  once(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    this._singleton._bus.once(id, callback);
  }

  off(id: DomSideMessageId, callback: DomSideMessageCallback): boolean {
    return this._singleton._bus.off(id, callback);
  }

  any(callback: DomSideMessageCallback): void {
    return this._singleton._bus.any(callback);
  }

  handle(id: DomSideMessageId, callback: DomSideInvokeCallback): void {
    this._singleton._bus.handle(id, callback);
  }

  handleOnce(id: DomSideMessageId, callback: DomSideInvokeCallback): void {
    this._singleton._bus.handleOnce(id, callback);
  }

  removeHandler(id: DomSideMessageId): boolean {
    return this._singleton._bus.removeHandler(id);
  }

  _registerSingleton(inst: IDomSideInstance) {
    if (this._singleton) throw new Error("Double registration of DOM Side singleton");

    this._singleton = inst;

    globalThis.DomSideHandler = this;
  }
}

export default IDomSideType;
