import { useEffect, useState, useRef } from "react";
import { Playground } from "./Playground";
import { SupportedLanguages } from "@/features/Problem/constants/SupportedLanguages";
import { BsCode } from "rocketicons/bs";
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
import { BoilerplateType } from "../../types/LanguageCodeType";
import { problemAPI } from "@/lib/api";
import { useParams } from "react-router-dom";
import { AlertDialog, Button, EmptyMessage } from "@/components/ui";
import { AlignLeft, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/shadcn/tooltip";
import { useCodeStorage } from "@/hooks";
interface RenderPGTabsProps {
  setLanguagePackage: (langJudge0: LanguageCodeType, code: string) => void;
  mode?: "user" | "admin";
  boilerplateCodeFromAdmin?: string;
  passingProblemId?: string;
}

export const RenderPGTabs = ({
  setLanguagePackage,
  mode = "user",
  boilerplateCodeFromAdmin,
  passingProblemId
}: RenderPGTabsProps) => {
  const [playgroundActive, setPlaygroundActive] = useState("Code");
  const [language, setLanguage] = useState<SupportedLanguages>(SupportedLanguages.Python);
  const [matchingLanguage, setMatchingLanguage] = useState<LanguageCodeType>(DEFAULT_LANGUAGE_CODE);
  const [code, setCode] = useState("");
  const [boilerplateCode, setBoilerplateCode] = useState("");
  const paramsProblemId = useParams<{ problemId: string }>().problemId;
  const [boilerplateList, setBoilerplateList] = useState<BoilerplateType[]>([]);
  const [isSavingCode, setIsSavingCode] = useState(false);

  const problemId = passingProblemId || paramsProblemId;

  // Code storage hook for saving/loading user code
  const codeStorage = useCodeStorage(problemId, language);

  // For function buttons
  const playgroundRef = useRef<{ codeFormat: () => void }>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (mode === "user") {
      getBoilerplateCode();
    } else if (mode === "admin") {
      setBoilerplateCode(boilerplateCodeFromAdmin || "");
      setCode(boilerplateCodeFromAdmin || "");
    }
  }, [problemId]);

  const getBoilerplateCode = async () => {
    if (!problemId) return;
    const response = await problemAPI.getBoilerplateCode(problemId);
    const boilerplateList: BoilerplateType[] = response.result;

    setBoilerplateList(boilerplateList);

    // First, try to load stored code from localStorage
    const storedCode = codeStorage.loadCode();

    if (storedCode) {
      // Use stored code if available
      setCode(storedCode);
      setBoilerplateCode(storedCode);
    } else {
      // Fall back to boilerplate code
      const matchingBoilerplate = boilerplateList.find(
        // Find the matching with the start name, if 2 languages have the same start name, it will return the first one
        (boilerplate) => boilerplate.longName.toLowerCase().startsWith(language.toLowerCase())
      );

      if (matchingBoilerplate) {
        setBoilerplateCode(matchingBoilerplate.code);
        setCode(matchingBoilerplate.code); // Set the boilerplate code if a match is found
      } else {
        setBoilerplateCode("");
        setCode(""); // Set the code to empty if no match is found
      }
    }
  };

  useEffect(() => {
    const languageNameJudge0 = LanguageCodes.find((lang) => lang.name.toLowerCase().startsWith(language.toLowerCase()));
    if (languageNameJudge0) {
      setLanguagePackage(languageNameJudge0, code);
    }
  }, [language]);

  const matchLanguage = (language: SupportedLanguages) => {
    const matchingLanguage = LanguageCodes.find((lang) => lang.name.toLowerCase().startsWith(language.toLowerCase()));
    if (matchingLanguage) {
      setMatchingLanguage(matchingLanguage);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    matchLanguage(language);
    setLanguagePackage(matchingLanguage, newCode);

    // Set saving status to true when code changes
    setIsSavingCode(true);

    // Clear any previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save code to localStorage with debouncing
    codeStorage.saveCode(newCode);

    // Set a timeout to change the status to "Saved" after 2 seconds
    saveTimeoutRef.current = setTimeout(() => {
      setIsSavingCode(false);
    }, 2000);
  };

  const handleLanguageChange = (newLanguage: SupportedLanguages) => {
    setLanguage(newLanguage);
    setIsSavingCode(true);

    // Create a temporary code storage instance for the new language to check for stored code
    const newLanguageStorageKey = `problem_code_${problemId}_${newLanguage.toLowerCase()}`;
    let storedCodeForNewLanguage: string | null = null;

    try {
      const storedData = localStorage.getItem(newLanguageStorageKey);
      if (storedData) {
        const data = JSON.parse(storedData);
        storedCodeForNewLanguage = data.code;
      }
    } catch (error) {
      console.warn("Failed to load stored code for new language:", error);
    } finally {
      setIsSavingCode(false);
    }

    if (storedCodeForNewLanguage) {
      // Use stored code if available for the new language
      setCode(storedCodeForNewLanguage);
    } else {
      // Fall back to boilerplate code for the new language
      const matchingBoilerplate = boilerplateList.find(
        (boilerplate) => newLanguage.toLowerCase() === boilerplate.shortName.toLowerCase()
      );

      if (matchingBoilerplate) {
        setCode(matchingBoilerplate.code); // Set the boilerplate code if a match is found
      } else {
        setCode(""); // Set the code to empty if no match is found
      }
    }
  };

  const renderPlaygroundTabButton = (tabName: string) => {
    const getIcon = () => {
      const iconColorClass = playgroundActive === tabName ? "icon-appAccent" : "icon-gray3";
      switch (tabName) {
        case "Code":
          return <BsCode className={`inline-block mr-2 ${iconColorClass}`} />;
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
      case "Code":
        return (
          <div className="flex-grow overflow-hidden">
            <Playground ref={playgroundRef} language={language} code={code} onCodeChange={handleCodeChange} />
          </div>
        );
      default:
        return <EmptyMessage message="This tab is not implemented yet." />;
    }
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full">
      {/* Tab Buttons */}
      <div
        id="tab-buttons"
        className="flex items-center justify-between px-4 py-2 overflow-y-hidden border-b max-h-18 gap-x-4 sm:overflow-x-auto scrollbar-hide shrink-0"
      >
        {renderPlaygroundTabButton("Code")}

        <div className="flex space-x-2">
          <div className="function-buttons [&_svg]:size-[14px] text-gray3">
            <Tooltip>
              <AlertDialog
                title="Reset Code"
                message="Are you sure you want to reset the code?"
                onConfirm={() => {
                  setCode(boilerplateCode);
                  codeStorage.clearCode(); // Clear stored code when resetting
                }}
              >
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
                    <RotateCcw />
                  </div>
                </TooltipTrigger>
              </AlertDialog>
              <TooltipContent>
                <p>Reset Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => playgroundRef.current?.codeFormat()}>
                  <AlignLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Format Code</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="language-selector">
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
                  onValueChange={(value) => {
                    const selectedLanguage = value as SupportedLanguages;
                    handleLanguageChange(selectedLanguage); // Handle language change
                  }}
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
        {/* Language Selector */}
      </div>

      {/* Main content area */}
      <div className="flex flex-col h-[calc(100%-44px)]">
        {/* Playground Content */}
        <div id="playground-content" className="flex-grow overflow-y-auto scrollbar-hide">
          {renderPlaygroundTabContent()}
        </div>

        {/* Simple Save Status Indicator - Sticky at bottom */}
        {mode === "user" && (
          <div className="sticky bottom-0 px-4 py-2 text-xs text-muted-foreground">
            {isSavingCode ? "Saving..." : "Saved"}
          </div>
        )}
      </div>
    </div>
  );
};
