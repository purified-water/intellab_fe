export interface IPageable {
  pageNumber: number;
  pageSize: number;
  sort: { property: string; direction: "ASC" | "DESC" }[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
