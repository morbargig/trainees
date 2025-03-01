import { BaseCellData } from '../table.types.helpers';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonCellDataModel<T = any, K extends keyof T = keyof T>
  extends BaseCellData<T, K> {}
