import type { ReactNode } from "react";

interface EmptyStatePropsType {
  content: ReactNode;
}

const EmptyState = ({ content }: EmptyStatePropsType) => {
  return (
  <div className={`w-screen h-dvh flex justify-center items-center font-bold text-red-600 text-2xl `}>
    <div className={` border-2 text-center`}>
      {content}
      </div>
    </div>);
};

export default EmptyState;
