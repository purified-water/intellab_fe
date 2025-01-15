/**
 * Save the selected answers to localStorage
 * @param lessonId - The ID of the lesson for unique storage
 * @param selectedAnswers - The user's selected answers
 */
export const saveQuizDraft = (lessonId: string, selectedAnswers: Record<string, number | null>) => {
  if (!lessonId) return;
  localStorage.setItem(`quizDraft_${lessonId}`, JSON.stringify(selectedAnswers));
};

/**
 * Load the saved draft from localStorage
 * @param lessonId - The ID of the lesson to retrieve saved answers
 * @returns The selected answers object or an empty object if no draft exists
 */
export const loadQuizDraft = (lessonId: string): Record<string, number | null> => {
  if (!lessonId) return {};
  const savedDraft = localStorage.getItem(`quizDraft_${lessonId}`);
  return savedDraft ? JSON.parse(savedDraft) : {};
};

/**
 * Clear the saved draft from localStorage
 * @param lessonId - The ID of the lesson to clear draft for
 */
export const clearQuizDraft = (lessonId: string) => {
  if (!lessonId) return;
  localStorage.removeItem(`quizDraft_${lessonId}`);
};
