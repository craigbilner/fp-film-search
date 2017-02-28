// @flow

export type CMD = 'INIT' | 'INITTED';

export type Model = {
  hasInitiated: boolean,
};

export type UpdateCMD = {
  CMD: CMD,
  data?: any,
};

export type Update = (u: UpdateCMD, m: Model) => Model;

export type DOMUpdate = {
  elId: string,
  html: string,
};

export type View = (m: Model) => DOMUpdate[];

export type NodeUpdate = (id: string, html: string) => void;

export type AppOpts = {
  key? : string,
};
