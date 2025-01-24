import { Files } from 'lucide-react'
import { MarkdownRender } from '@/features/Problem/components/MarkdownRender';
import { useToast } from '@/hooks/use-toast';
import { FaFilePdf } from 'rocketicons/fa';
import { aiAPI } from '@/lib/api';

interface CourseSummaryDialogProps {
  isOpen: boolean;
  summaryContent: string;
  onClose: () => void;
}

export default function CourseSummaryDialog(props: CourseSummaryDialogProps) {
  const { isOpen, summaryContent, onClose } = props;
  const { toast } = useToast();

  if (!isOpen) return null;

  const renderHeader = () => {
    return (
      <div className='flex text-black text-2xl justify-between py-4 px-8 border-b border-[#999999]'>
        <p className='font-bold '>Course Summary</p>
        <p className='cursor-pointer text-[#999999]' onClick={onClose} >X</p>
      </div>
    )
  }

  const renderBody = () => {
    return (
      <div className='h-[700px] px-8 py-3 text-black overflow-y-auto'>
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
      a.download = "summary.pdf"; // Specify the filename
      document.body.appendChild(a);
      a.click();

      // Clean up the DOM
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Saved!',
        description: 'Summary saved as PDF',
      });
    } catch (error: any) {
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
      <div className='flex justify-between text-black text-base py-4 px-8'>
        <button className='flex items-center py-2 px-10 font-bold border border-appPrimary rounded-xl hover:bg-slate-200' onClick={handleSaveAsPDF}>
          <FaFilePdf className='mr-2' />
          <p>Save as PDF</p>
        </button>
        <Files onClick={handleCopySummaryContent} size={25} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9] bg-opacity-75">
      <div className="bg-white rounded-2xl min-w-[900px] w-full mx-[400px]">
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    </div>
  )
}
