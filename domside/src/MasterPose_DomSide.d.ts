declare type DomSideMessageValue = JSONValue;
declare type DomSideMessageId = string;

declare type DomSideMessage = [DomSideMessageValue, DomSideMessageId];
declare type DomSideMessageCallback = (data: DomSideMessageValue, id: DomSideMessageId) => void;
declare type DomSideInvokeCallback = (data: DomSideMessageValue, id: DomSideMessageId) => JSONValue | Promise<JSONValue>;

declare interface IDomSideHandler {
  // Events

  on(id: DomSideMessageId, callback: DomSideMessageCallback): void;
  once(id: DomSideMessageId, callback: DomSideMessageCallback): void;
  off(id: DomSideMessageId, callback: DomSideMessageCallback): boolean;
  any(callback: DomSideMessageCallback): void;

  // Procedures

  handle(id: DomSideMessageId, callback: DomSideInvokeCallback): void;
  handleOnce(id: DomSideMessageId, callback: DomSideInvokeCallback): void;
  removeHandler(id: DomSideMessageId): boolean;

  // Communicate

  send(id: string, data: DomSideMessageValue): void;
  invoke(id: string, data: DomSideMessageValue): Promise<DomSideMessageValue>;
}

declare var DomSideHandler: IDomSideHandler;
