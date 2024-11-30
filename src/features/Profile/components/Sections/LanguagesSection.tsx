export const LanguagesSection = () => {
  const languages = [
    { name: "JavaScript", solved: "20 Problems Solved" },
    { name: "Python3", solved: "15 Problems Solved" },
    { name: "C++", solved: "15 Problems Solved" }
  ];

  return (
    <div className="flex flex-col min-w-full">
      <div className="text-2xl font-semibold text-black1">Languages</div>
      {languages.map((language, index) => (
        <div key={index} className="flex items-center justify-between pt-4">
          <div className="text-lg font-normal text-black1">{language.name}</div>
          <div className="text-lg font-normal text-black1">{language.solved}</div>
        </div>
      ))}
    </div>
  );
};
