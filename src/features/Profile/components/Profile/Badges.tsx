export const Badges = () => {
  const renderEmpty = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray3">No badges yet</p>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-2xl font-bold text-appPrimary">Badges</p>
      <div className="border-t-2 border-gray5"></div>
      {renderEmpty()}
    </div>
  );
};
