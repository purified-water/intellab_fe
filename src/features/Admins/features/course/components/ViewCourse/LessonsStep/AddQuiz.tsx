import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/shadcn";
import { Button } from "@/components/ui";
import { useFormContext } from "react-hook-form";
import { CreateQuizSchema } from "../../../schemas/createQuizSchema";
import { useEffect } from "react";

interface AddQuizProps {
  readOnly?: boolean;
}

export const AddQuiz = ({ readOnly }: AddQuizProps) => {
  const {
    watch,
    setValue,
    register,
    formState: { errors }
  } = useFormContext<{ lessonQuiz: CreateQuizSchema }>();

  const value = watch("lessonQuiz");

  useEffect(() => {
    const calculateTotalQuestions = () => {
      if (value.quizQuestions.length > 0) {
        const totalQuestions = value.quizQuestions.length;
        setValue("lessonQuiz.totalQuestions", totalQuestions);
      }
    };
    calculateTotalQuestions();
  }, [value.quizQuestions]);

  const handleChange = (partial: Partial<CreateQuizSchema>) => {
    setValue("lessonQuiz", { ...value, ...partial }, { shouldValidate: true });
  };

  const updateQuestion = (index: number, updated: CreateQuizSchema["quizQuestions"][number]) => {
    const quizQuestions = [...value.quizQuestions];
    quizQuestions[index] = updated;
    handleChange({ quizQuestions });
  };

  const addQuestion = () => {
    handleChange({
      quizQuestions: [
        ...value.quizQuestions,
        {
          questionId: Date.now().toString(),
          questionTitle: "Untitled Question",
          correctAnswer: 1,
          options: [
            { order: 1, option: "Option 1" },
            { order: 2, option: "Option 2" },
            { order: 3, option: "Option 3" },
            { order: 4, option: "Option 4" }
          ]
        }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const updated = value.quizQuestions.filter((_, i) => i !== index);
    handleChange({ quizQuestions: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm">
          Total questions: {value.quizQuestions.length}
          {errors.lessonQuiz?.totalQuestions && (
            <p className="text-sm text-appHard">{errors.lessonQuiz.totalQuestions.message}</p>
          )}
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>Questions shown per quiz:</span>
              <Input
                type="number"
                {...register("lessonQuiz.displayedQuestions", { valueAsNumber: true })}
                className="w-20"
                disabled={readOnly}
              />
            </div>
            {errors.lessonQuiz?.displayedQuestions && (
              <p className="text-sm text-appHard">{errors.lessonQuiz.displayedQuestions.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>Number of correct questions to pass:</span>
              <Input
                type="number"
                {...register("lessonQuiz.requiredCorrectQuestions", { valueAsNumber: true })}
                className="w-20"
                disabled={readOnly}
              />
            </div>
            {errors.lessonQuiz?.requiredCorrectQuestions && (
              <p className="text-sm text-appHard">{errors.lessonQuiz.requiredCorrectQuestions.message}</p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium">Quiz questions</h3>

        {typeof errors.lessonQuiz?.quizQuestions?.message === "string" && (
          <p className="text-sm text-appHard">{errors.lessonQuiz.quizQuestions.message}</p>
        )}

        {value.quizQuestions.map((q, qIdx) => {
          const questionError = errors.lessonQuiz?.quizQuestions?.[qIdx];

          return (
            <div key={q.questionId} className="p-4 space-y-2 border rounded-xl">
              <div className="space-y-1">
                <Input
                  value={q.questionTitle}
                  onChange={(e) => updateQuestion(qIdx, { ...q, questionTitle: e.target.value })}
                  className="font-medium border-none shadow-none"
                  disabled={readOnly}
                />
                {questionError?.questionTitle && (
                  <p className="text-sm text-appHard">{questionError.questionTitle.message}</p>
                )}
              </div>

              {q.options.map((opt, i) => {
                const optionError = questionError?.options?.[i];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.questionId}`}
                      checked={q.correctAnswer === opt.order}
                      onChange={() => updateQuestion(qIdx, { ...q, correctAnswer: opt.order })}
                      disabled={readOnly}
                    />
                    <div className="flex flex-col w-full gap-1">
                      <Input
                        value={opt.option}
                        onChange={(e) => {
                          const newOptions = q.options.map((o, idx) =>
                            idx === i ? { ...o, option: e.target.value } : o
                          );
                          updateQuestion(qIdx, { ...q, options: newOptions });
                        }}
                        disabled={readOnly}
                      />
                      {optionError?.option && <p className="text-sm text-appHard">{optionError.option.message}</p>}
                    </div>
                  </div>
                );
              })}

              <button type="button" disabled={readOnly} onClick={() => removeQuestion(qIdx)}>
                <Trash2 className="size-4 text-gray3 hover:text-gray2" />
              </button>
            </div>
          );
        })}

        <div className="mt-4">
          <Button type="button" variant="outline" className="w-full" onClick={addQuestion} disabled={readOnly}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Question
          </Button>
        </div>
      </div>

      {typeof errors.lessonQuiz?.message === "string" && (
        <p className="text-sm text-appHard">{errors.lessonQuiz.message}</p>
      )}
    </div>
  );
};
