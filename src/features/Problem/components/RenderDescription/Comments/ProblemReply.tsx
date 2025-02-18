interface ProblemReplyProps {
  avatar: string;
  name: string;
  content: string;
  date: string;
}

export const ProblemReply = ({ avatar, name, content, date }: ProblemReplyProps) => {
  return (
    <div className="mt-4 ml-8">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray5">
          {avatar ? <img src={avatar} alt="Avatar" className="object-cover w-full h-full rounded-full" /> : null}
        </div>

        <div className="w-full text-sm px-4 py-2 border rounded-lg resize-none max-h-[300px] overflow-y-scroll bg-gray6">
          <div id="reply-info" className="flex items-center justify-between">
            <p className="font-semibold">{name}</p>
            <p className="text-xs font-medium text-gray3">{date}</p>
          </div>

          <p className="mt-1 text-black">{content}</p>
        </div>
      </div>
    </div>
  );
};
