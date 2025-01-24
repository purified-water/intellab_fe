export const QuizHeader = () => {
  return (
    <div id="background" className={`flex items-center w-full py-4 mb-5 bg-gray5`}>
      <div id="container" className="flex items-center justify-between w-full px-8 md:px-36">
        <>
          <div id="message" className="text-gray1">
            <h2 className="text-xl font-bold">Complete the quizz below</h2>
            <p>Score 70% or higher to pass</p>
          </div>
        </>
      </div>
    </div>
  );
};
