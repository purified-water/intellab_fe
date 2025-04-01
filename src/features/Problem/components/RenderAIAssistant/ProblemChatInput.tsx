import { useState } from "react";
import { Check, ChevronDown, Lightbulb, SendHorizonal } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { CHATBOT_MODELS } from "@/constants/chatbotModels";
import { Button } from "@/components/ui";
import { FaSpinner, FaSquare } from "rocketicons/fa6";

interface ProblemChatInputProps {
  input: string;
  setInput: (input: string) => void;
  chatModel: string;
  setChatModel: (model: string) => void;
  handleSendMessage: () => void; // Updated function signature
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isSubmitting: boolean;
  isLoading: boolean;
  handleCancel: () => void;
  messageCount: number;
}

export const ProblemChatInput = ({
  input,
  setInput,
  chatModel,
  setChatModel,
  handleSendMessage,
  textAreaRef,
  isSubmitting,
  isLoading,
  handleCancel,
  messageCount
}: ProblemChatInputProps) => {
  const [modelChangeOpen, setModelChangeOpen] = useState(false);
  let isUnlimited = false;

  if (messageCount > 1000)
    isUnlimited = true;
  
  return (
    <div className="sticky z-10 flex-col items-end px-2 mx-2 mt-4 border rounded-lg bottom-4">
      <textarea
        ref={textAreaRef}
        rows={1}
        placeholder="Ask about the problem..."
        className="h-10 text-sm shadow-sm max-h-[150px] w-full min-h-10 px-2 py-2 bg-white focus:outline-none leading-relaxed"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        disabled={isLoading || isSubmitting} // Disable input when submitting or streaming
      />

      <div id="bottom-bar" className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center space-x-1 models-message-count">
          <div className="flex items-center justify-center text-xs font-semibold">
            <Lightbulb className=" w-3 h-3 mr-[2px]" />
            {isUnlimited ? (
              <span className="">&infin;</span>
            ) : (
              <span>{messageCount}</span>
            )}
          </div>
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
        </div>


        {isLoading ? (
          <FaSpinner className="inline-block cursor-not-allowed icon-sm animate-spin icon-gray3" />
        ) : isSubmitting ? (
          <Button
            variant="ghost"
            onClick={handleCancel} // Stop streaming on click
            className="flex items-center justify-center w-6 h-6 p-1 rounded-lg text-gray3 hover:text-gray2"
          >
            <FaSquare />
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={handleSendMessage}
            className="flex items-center justify-center w-6 h-6 p-1 rounded-lg text-gray3 hover:text-gray2"
          >
            <SendHorizonal className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};
