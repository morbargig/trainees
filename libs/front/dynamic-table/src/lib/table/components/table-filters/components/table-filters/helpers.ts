import { MatchMode } from '../../lazy-load-event.type';

export type ITableFilterOption<T = any, K extends keyof T = keyof T> = {
  label?: string;
  value?: T[K];
};

export type ITableFilter<T = any> = {
  [K in keyof T]-?: {
    label: string;
    key: K;
    type?: HTMLInputElement['type'];
    // initialValue?: {
    //   (this: ITableFilter<T>): ITableFilter<T>['options'][number];
    // };
    // options: ITableFilterOption<T, K>[];
    // matchMode: MatchMode;

    matchModes: {
      label: string;
      matchMode: MatchMode;
    }[];
  };
}[keyof T];
