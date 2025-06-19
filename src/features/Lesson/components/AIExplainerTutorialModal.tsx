import { Button } from "@/components/ui";
import { AIExplainer1, AIExplainer2 } from "@/assets";
import React from "react";

export const AIExplainerTutorialModal = React.memo(({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray1/50 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-semibold text-center">Study faster with Intellab AI</h2>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center w-full h-full p-12">
              <img src={AIExplainer1} alt="AI explainer tutorial 1" className="object-fit" loading="lazy" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">1. Toggle on AI Explainer</h3>
              <p className="text-sm text-gray3">
                Click the orb icon at the bottom right corner to enable the AI Explainer.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center w-full h-full">
              <img src={AIExplainer2} alt="AI explainer tutorial 2" className="object-contain" loading="lazy" />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="mb-1 text-lg font-semibold">2. Highlight the text</h3>
              <p className="text-sm text-gray3">
                Select the text you want to understand. A contextual menu will appear with AI options.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full py-5 text-base transition rounded-lg bg-gradient-to-r from-appAIFrom to-appAITo hover:opacity-80"
        >
          Got it
        </Button>
      </div>
    </div>
  );
});

AIExplainerTutorialModal.displayName = "AIExplainerTutorialModal";
