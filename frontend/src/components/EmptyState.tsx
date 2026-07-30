import type { ReactNode } from "react";

interface EmptyStatePropsType {
  content: ReactNode;
  position?:number
}

const EmptyState = ({ content,position }: EmptyStatePropsType) => {
  return (
  <div className={`flex justify-center items-center relative top-${position} font-bold text-red-600 text-2xl`}>
    {content}
    </div>);
};

export default EmptyState;
