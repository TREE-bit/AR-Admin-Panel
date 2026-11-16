export interface ResultSchema<T = any> {
  readonly code: number
  data: T
  readonly msg: string
}
