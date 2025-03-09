import { useState } from "react";
import { Check, ChevronDown, SendHorizonal } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { CHATBOT_MODELS } from "@/constants/enums/chatbotModels";
import { Button } from "@/components/ui";

interface ProblemChatInputProps {
  input: string;
  setInput: (input: string) => void;
  chatModel: string;
  setChatModel: (model: string) => void;
  handleSendMessage: (input: string, model: string) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

export const ProblemChatInput = ({
  input,
  setInput,
  chatModel,
  setChatModel,
  handleSendMessage,
  textAreaRef
}: ProblemChatInputProps) => {
  const [modelChangeOpen, setModelChangeOpen] = useState(false);
  return (
    <div className="sticky z-10 flex-col items-end px-2 mx-2 mt-4 border rounded-lg bottom-4">
      <textarea
        ref={textAreaRef}
        rows={1}
        placeholder="Ask anything about the problem..."
        className="input-area flex-grow text-sm shadow-sm max-h-[150px] w-full min-h-8 px-2 py-2 bg-white resize-y focus:outline-none leading-relaxed"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.ctrlKey) {
            e.preventDefault();
            handleSendMessage(input, chatModel);
            setInput("");
          }
        }}
      />

      <div id="bottom-bar" className="flex items-center justify-between w-full">
        <Popover open={modelChangeOpen} onOpenChange={setModelChangeOpen}>
          <PopoverTrigger asChild>
            <div
              role="combobox"
              aria-expanded={modelChangeOpen}
              className="flex items-center px-1 space-x-1 text-xs rounded-lg cursor-pointer hover:bg-accent"
            >
              <span className="font-semibold ">
                {CHATBOT_MODELS.find((modelItem) => modelItem.value === chatModel)?.label}
              </span>
              <ChevronDown className="w-4 opacity-50" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-fit max-w-[150px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {CHATBOT_MODELS.map((modelItem) => (
                    <CommandItem
                      key={modelItem.value}
                      value={modelItem.value}
                      onSelect={(currentValue) => {
                        setChatModel(currentValue === chatModel ? "" : currentValue);
                        setModelChangeOpen(false);
                      }}
                    >
                      {modelItem.label}
                      <Check className={chatModel === modelItem.value ? "opacity-100" : "opacity-0"} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={() => {
            handleSendMessage(input, chatModel);
            setInput("");
          }}
          className="flex items-center justify-center w-6 h-6 p-1 rounded-lg text-gray3 hover:text-gray2"
        >
          <SendHorizonal className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
