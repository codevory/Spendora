import type { ReactNode } from "react";

interface CategoryModalPropsType {
  onClose: () => void;
  form: ReactNode;
}
const ModalBox = ({ onClose, form }: CategoryModalPropsType) => {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-5 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="btn-primary absolute right-2 top-1 z-100"
        >
          Close
        </button>
        {form}
      </div>
    </div>
  );
};

export default ModalBox;
