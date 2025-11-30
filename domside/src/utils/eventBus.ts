export class DomSideEventBus {
  #eventAnyHandlers = new Set<DomSideMessageCallback>();
  #eventHandlers = new Map<string, Set<DomSideMessageCallback>>();
  #invokeHandlers = new Map<string, DomSideInvokeCallback>();

  on(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    this.getEventHandler(id).add(callback);
  }

  once(id: DomSideMessageId, callback: DomSideMessageCallback): void {
    const onceEvent: DomSideMessageCallback = (data, id) => {
      try {
        callback(data, id)
      } catch (error) {
        console.error(error);
      }
      this.getEventHandler(id).delete(onceEvent);
    }
    this.getEventHandler(id).add(onceEvent);
  }

  off(id: DomSideMessageId, callback: DomSideMessageCallback): boolean {
    return this.getEventHandler(id).delete(callback);
  }

  any(callback: DomSideMessageCallback): void {
    this.getAnyEventHandlers().add(callback);
  }

  handle(id: DomSideMessageId, callback: DomSideInvokeCallback) {
    this.getInvokeHandlers().set(id, callback);
  }

  handleOnce(id: DomSideMessageId, callback: DomSideInvokeCallback): void {
    const onceInvoke: DomSideInvokeCallback = async (data, id) => {
      let result!: JSONValue;
      let error;

      try {
        result = await Promise.resolve(callback(data, id));
      } catch (e) {
        error = e;
      }

      this.#invokeHandlers.delete(id);

      if (error) throw error;

      return result;
    }

    this.#invokeHandlers.set(id, onceInvoke);
  }

  removeHandler(id: DomSideMessageId): boolean {
    return this.#invokeHandlers.delete(id);
  }

  getEventHandler(id: string) {
    let eventHandlers;

    if (this.#eventHandlers.has(id)) {
      eventHandlers = this.#eventHandlers.get(id)!;
    } else {
      eventHandlers = new Set<DomSideMessageCallback>();
      this.#eventHandlers.set(id, eventHandlers);
    }

    return eventHandlers;
  }

  getAnyEventHandlers() {
    return this.#eventAnyHandlers;
  }

  getInvokeHandlers() {
    return this.#invokeHandlers;
  }
}
