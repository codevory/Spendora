import type { ReactNode } from "react";

interface EmptyStatePropsType {
  content: ReactNode;
}

const EmptyState = ({ content }: EmptyStatePropsType) => {
  return (
  <div className="flex justify-center items-center mt-[50%] font-bold text-red-600 text-2xl">
    {content}
    </div>);
};

export default EmptyState;
