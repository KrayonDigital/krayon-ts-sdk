export interface Pageable<T> {
  count: number;
  next: null;
  previous: null;
  data: T[];
}
