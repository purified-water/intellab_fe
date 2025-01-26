interface Bookmarks {
  [userId: string]: {
    [lessonId: string]: string; // Maps lesson IDs to last viewed section IDs
  };
}

export const getBookmarks = (): Bookmarks => {
  return JSON.parse(localStorage.getItem("bookmarks") || "{}");
};

export const saveBookmarks = (bookmarks: Bookmarks): void => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

export const addBookmark = (userId: string, lessonId: string, sectionId: string): void => {
  const bookmarks = getBookmarks();
  if (!bookmarks[userId]) {
    bookmarks[userId] = {};
  }
  bookmarks[userId][lessonId] = sectionId;
  saveBookmarks(bookmarks);
};

export const getBookmark = (userId: string, lessonId: string): string | null => {
  const bookmarks = getBookmarks();
  return bookmarks[userId]?.[lessonId] || null;
};

export const clearBookmark = (userId: string, lessonId: string): void => {
  const bookmarks = getBookmarks();
  if (bookmarks[userId]) {
    delete bookmarks[userId][lessonId];
    if (Object.keys(bookmarks[userId]).length === 0) {
      delete bookmarks[userId];
    }
    saveBookmarks(bookmarks);
  }
};
