import {
  BreadcrumbPage,
  //BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react"

export interface IBreadCrumpItem {
  title: string;
  path: string;
}

interface BreadCrumpProps {
  items: IBreadCrumpItem[];
}

export default function BreadCrump(props: BreadCrumpProps) {
  const { items } = props;
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  }

  // NOTE: The default BreadcrumbSeparator of shadcn uses css for styling
  // which conflict with the tailwind config, making it looks weird
  // So I created a custom separator here
  const renderSeparator = () => {
    return (<ChevronRight className="mx-1 text-appPrimary" />)
  }

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <BreadcrumbPage
            className="text-appPrimary hover:underline cursor-pointer text-2xl font-bold"
            onClick={() => handleClick(item.path)}
          >
            {item.title}
          </BreadcrumbPage>
          {index < items.length - 1 && renderSeparator()}
        </span>
      ))}
    </div>
  );
}