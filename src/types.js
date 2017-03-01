// @flow

export type CMD =
  'INIT'
    | 'INITTED'
    | 'SEARCH'
    | 'SEARCH_SUCCESS'
    | 'SEARCH_FAIL';

export type Model = {
  hasInitiated: boolean,
  AUTH_KEY: string,
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
export type DOMEventsType = (c: CMD) => (evt: UIEvent) => void;

export type AppOpts = {
  key? : string,
};

export type HttpProps = {
  OK: CMD,
  ERR: CMD,
  url: string,
};
