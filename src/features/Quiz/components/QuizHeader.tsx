interface QuizHeaderProps {
  questionCount: number;
}

export const QuizHeader = ({ questionCount }: QuizHeaderProps) => {
  const questionsToPass = Math.ceil(questionCount * 0.7);

  return (
    <div id="background" className={`flex items-center w-full py-4 mb-5 bg-gray5`}>
      <div id="container" className="flex items-center justify-between w-full px-8 md:px-36">
        <>
          <div id="message" className="text-gray1">
            <h2 className="text-xl font-bold">Complete the quiz below</h2>
            <p>Answer {questionsToPass} questions correctly or higher to pass</p>
          </div>
        </>
      </div>
    </div>
  );
};
