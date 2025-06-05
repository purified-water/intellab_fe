import { Button } from "@/components/ui/Button";

interface QuizResultProps {
  isCorrect: boolean | null;
  grade: number | null;
  onClick: () => void;
}

export const QuizResult = ({ isCorrect, grade, onClick }: QuizResultProps) => {
  if (isCorrect === null || grade === null) return null;

  return (
    <div id="background" className={`flex items-center w-full py-4 mb-5 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
      <div id="container" className="flex items-center justify-between w-full px-8 md:px-36">
        {isCorrect ? (
          <>
            <div id="message" className="text-appEasy">
              <h2 className="text-xl font-bold">Congrats! All answers all correct</h2>
              <p>Grade received: {grade}%. To pass: 70% or higher</p>
            </div>

            <Button
              type="button"
              onClick={onClick}
              className="px-4 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80"
            >
              Return to course
            </Button>
          </>
        ) : (
          <>
            <div id="message" className="text-appHard">
              <h2 className="text-xl font-bold">Try again once you are ready</h2>
              <p>Grade received: {grade}%. To pass: 70% or higher</p>
            </div>

            <Button
              type="button"
              onClick={onClick}
              className="px-4 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
