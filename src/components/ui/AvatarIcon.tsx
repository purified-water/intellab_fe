import { MdAccountCircle } from "rocketicons/md";

interface AvatarIconProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

export function AvatarIcon(props: AvatarIconProps) {
  const { src, alt, onClick } = props;

  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5 cursor-pointer" onClick={onClick}>
      {src ? <img src={src} alt={alt} className="object-cover w-full h-full rounded-full" /> : <MdAccountCircle className="w-full h-full" />}
    </div>
  )
}
