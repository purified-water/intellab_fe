import { useEffect, useState } from "react";
import { Playground } from "./Playground";
import { SupportedLanguages } from "@/features/Problem/constants/SupportedLanguages";
import { BsCode } from "rocketicons/bs";
import { FaRobot } from "rocketicons/fa";
import { Separator } from "@/components/ui/Separator";
import { MdKeyboardArrowDown } from "rocketicons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { DEFAULT_LANGUAGE_CODE, LanguageCodes } from "../../constants/LanguageCodes";
import { LanguageCodeType } from "../../types/LanguageCodeType";

interface RenderPGTabsProps {
  setLanguagePackage: (langJudge0: LanguageCodeType, code: string) => void;
}

export const RenderPGTabs = ({ setLanguagePackage }: RenderPGTabsProps) => {
  const [playgroundActive, setPlaygroundActive] = useState("Solution");
  const [language, setLanguage] = useState<SupportedLanguages>(SupportedLanguages.Python);
  const [matchingLanguage, setMatchingLanguage] = useState<LanguageCodeType>(DEFAULT_LANGUAGE_CODE);
  const [code, setCode] = useState("");

  useEffect(() => {
    const languageNameJudge0 = LanguageCodes.find((lang) => lang.name.includes(language));

    if (languageNameJudge0) {
      setLanguagePackage(languageNameJudge0, code);
    }
  }, [language]);

  const matchLanguage = (language: SupportedLanguages) => {
    const matchingLanguage = LanguageCodes.find((lang) => lang.name.includes(language));
    if (matchingLanguage) {
      setMatchingLanguage(matchingLanguage);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    matchLanguage(language);
    setLanguagePackage(matchingLanguage, newCode);
  };

  const renderPlaygroundTabButton = (tabName: string) => {
    const getIcon = () => {
      const iconColorClass = playgroundActive === tabName ? "icon-appAccent" : "icon-gray3";
      switch (tabName) {
        case "Solution":
          return <BsCode className={`inline-block mr-2 ${iconColorClass}`} />;
        case "Chatbot":
          return <FaRobot className={`inline-block mr-2 ${iconColorClass}`} />;
        default:
          return null;
      }
    };

    return (
      <button
        onClick={() => setPlaygroundActive(tabName)}
        className={`flex items-center ${
          playgroundActive === tabName ? "text-appAccent font-semibold" : "text-gray3 font-semibold"
        }`}
      >
        {getIcon()}
        {tabName}
      </button>
    );
  };

  const renderPlaygroundTabContent = () => {
    switch (playgroundActive) {
      case "Solution":
        return (
          <div className="flex-grow overflow-hidden">
            <Playground language={language} code={code} onCodeChange={handleCodeChange} />
          </div>
        );
      case "Chatbot":
        return <div>Chatbot</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div
        id="tab-buttons"
        className="flex items-center px-4 py-2 overflow-y-hidden border-b h-18 gap-x-4 sm:overflow-x-auto scrollbar-hide shrink-0"
      >
        {renderPlaygroundTabButton("Solution")}
        <Separator orientation="vertical" className="h-6" />
        {renderPlaygroundTabButton("Chatbot")}

        {/* Language Selector */}
        <div id="language-selector" className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center h-8 py-1 pl-2 pr-1 text-sm border rounded-lg hover:cursor-pointer">
                <p>{language}</p>
                <MdKeyboardArrowDown className="inline-block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={language}
                onValueChange={(value) => setLanguage(value as SupportedLanguages)}
              >
                {Object.values(SupportedLanguages).map((lang) => (
                  <DropdownMenuRadioItem key={lang} value={lang}>
                    {lang}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Playground Content */}
      <div id="playground-content" className="overflow-y-scroll">
        {renderPlaygroundTabContent()}
      </div>
    </div>
  );
};

// TODO sửa lỗi không lướt được cái codemirror với khi màn hình codemirror nhỏ mà xuống dòng thì nó đẩy
// cái tab button lên luôn không thấy nữa
