export interface StandardResponseMetaData {
  total?: number;
  size?: number;
  [k: string]: any;
}

export interface StandardResponse<T> {
  data: T | T[];
  meta?: StandardResponseMetaData;
}

export type AsyncStdRes<T> = Promise<Partial<StandardResponse<T>> | Partial<T>>;
export type SyncStdRes<T> = Partial<StandardResponse<T>> | Partial<T>;
