import { useState } from "react";
import { IQuiz } from "@/types";

interface QuizProps {
  quiz: IQuiz;
}

export const Quiz = (props: QuizProps) => {
  const { quiz } = props;

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSelection = (label: string) => {
    setSelectedAnswer(label);
  };

  const handleSubmit = () => {
    const answer = quiz.answers.find((a) => a.label === selectedAnswer);
    if (answer) {
      setIsCorrect(answer.isCorrect);
    }
  };

  return (
    <div className="border py-5 px-7 rounded-lg max-w-7xl">
      <p className="text-lg font-semibold mb-4">{quiz.question}</p>
      <ul className="space-y-2">
        {quiz.answers.map((answer) => (
          <li key={answer.label} className="flex items-center space-x-3">
            <input
              type="radio"
              id={answer.label}
              name="quiz"
              value={answer.label}
              checked={selectedAnswer === answer.label}
              onChange={() => handleAnswerSelection(answer.label)}
              className="form-radio"
            />
            <label htmlFor={answer.label} className="cursor-pointer">
              {answer.content}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswer}
        className="mt-4 px-10 py-2 bg-appPrimary text-white font-bold rounded-lg hover:bg-appFadedPrimary"
      >
        Answer
      </button>

      {isCorrect != null && (
        <p className={`mt-4 font-bold ${isCorrect ? "text-appEasy" : "text-appHard"}`}>
          {isCorrect ? "Correct" : "Incorrect"}
        </p>
      )}
    </div>
  );
};
