export interface NotificationType {
  id: number;
  type: "comment" | "achievement" | "alert";
  user?: string;
  content: string;
  modifiedDate: string;
}
