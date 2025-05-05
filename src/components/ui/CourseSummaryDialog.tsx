import { Files } from 'lucide-react'
import { MarkdownRender } from '@/features/Problem/components/MarkdownRender';
import { useToast } from '@/hooks/use-toast';
import { FaFilePdf } from 'rocketicons/fa';
import { aiAPI } from '@/lib/api';
import { X } from 'lucide-react';
import { Button } from "./Button";
import { useEffect } from 'react';

interface CourseSummaryDialogProps {
  courseName: string,
  isOpen: boolean;
  summaryContent: string;
  onClose: () => void;
}

export default function CourseSummaryDialog(props: CourseSummaryDialogProps) {
  const { courseName, isOpen, summaryContent, onClose } = props;
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen) return null;

  const renderHeader = () => {
    return (
      <div className='flex items-center justify-between px-6 py-2 text-xl text-black border-b border-gray5'>
        <p className='font-bold '>Course Summary</p>
        <Button className='-mr-2' variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>

      </div>
    )
  }

  const renderBody = () => {
    return (
      <div className='h-[600px] px-8 py-2 text-black overflow-y-auto'>
        <MarkdownRender content={summaryContent} />
      </div>
    )
  }

  const handleSaveAsPDF = async () => {
    try {
      const response = await aiAPI.getPDFSummaryFile();

      // Create a blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseName}_ai_summary.pdf`; // Specify the filename
      document.body.appendChild(a);
      a.click();

      // Clean up the DOM
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Saved!',
        description: 'Summary saved as PDF',
      });
    } catch (error) {
      toast({
        title: 'Failed to save as PDF',
        description: `Failed to save summary as PDF: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleCopySummaryContent = () => {
    navigator.clipboard.writeText(summaryContent);
    toast({
      title: 'Copied!',
      description: 'Summary content copied to clipboard',
    })
  }

  const renderFooter = () => {
    return (
      <div className='flex items-center justify-between px-6 py-4 text-base'>
        <button className='flex items-center px-8 py-1 space-x-2 font-semibold border rounded-lg text-gray2 border-gray3 hover:bg-gray5' onClick={handleSaveAsPDF}>
          <FaFilePdf className='icon-gray2 icon-sm' />
          <p>Save as PDF</p>
        </button>
        <Button variant="ghost" size="icon" onClick={handleCopySummaryContent} className='-mr-2 '>
          <Files className='cursor-pointer text-gray2' />
        </Button>

      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 bg-gray6">
      <div className="bg-white rounded-2xl min-w-[900px] w-full mx-[400px]">
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    </div>
  )
}
