interface CategoryProps {
  category: string;
}

export const Category = (props: CategoryProps) => {
  const { category } = props;

  return <div className="px-3 py-1 rounded-md border border-appPrimary shrink-0">{category}</div>;
};
