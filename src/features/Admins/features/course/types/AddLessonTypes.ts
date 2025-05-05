export interface LessonAction {
  type: "view" | "edit" | "duplicate" | "delete" | "add-blank" | "add-clone" | "default";
  lessonId?: string;
}
