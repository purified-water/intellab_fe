export const renderMessageWithUser = (message: string) => {
  const regex = /\[@(.*?)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    const [fullMatch, username] = match;
    parts.push(message.slice(lastIndex, match.index));
    parts.push(
      <span key={match.index} className="font-semibold text-appPrimary">
        {username}
      </span>
    );
    lastIndex = match.index + fullMatch.length;
  }

  parts.push(message.slice(lastIndex));
  return parts;
};
