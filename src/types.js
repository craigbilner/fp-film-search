// @flow

export type CMD = 'INIT' | 'INITTED' | 'SEARCH';

export type Model = {
  hasInitiated: boolean,
};

export type UpdateCMD = {
  CMD: CMD,
  data?: any,
};

export type Update = (u: UpdateCMD, m: Model) => Model;

export type DOMEvent = 'keyup';

export type Event = {
  CMD: CMD,
  type: DOMEvent,
  elId: string,
};

export type DOMUpdate = {
  elId: string,
  html: string,
  events?: Event[],
};

export type View = (m: Model) => DOMUpdate[];

// eslint-disable-next-line no-undef
export type DOMEvents = (c : CMD) => (evt: UIEvent) => void;

export type NodeUpdate = (id: string, html: string, de: DOMEvents, events?: Event[]) => void;

export type AppOpts = {
  key? : string,
};
