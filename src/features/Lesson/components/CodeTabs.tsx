import { useState } from "react";

interface CodeSection {
  language: string;
  code: string;
}

interface CodeTabsProps {
  sections: CodeSection[];
}

const CodeTabs = ({ sections }: CodeTabsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(sections.length > 0 ? sections[0].language : null);

  return (
    <div className="flex flex-col">
      {/* Render Tabs */}
      <div className="flex border-b border-gray-300">
        {sections.map(({ language }) => (
          <button
            key={language}
            className={`p-2 ${activeTab === language ? "border-b-2 border-blue-500 font-bold" : ""}`}
            onClick={() => setActiveTab(language)}
          >
            {language.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Render Code */}
      <div className="mt-4">
        {sections.map(
          ({ language, code }) =>
            activeTab === language && (
              <pre key={language} className="p-4 bg-gray-100 rounded">
                <code>{code}</code>
              </pre>
            )
        )}
      </div>
    </div>
  );
};

export default CodeTabs;
