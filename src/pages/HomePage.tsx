import intellab_default from "@/assets/logos/intellab_default.svg";

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold text-appPrimary">HomePage</span>
      <img src={intellab_default} alt="Intellab Logo" />
    </div>
  );
};
