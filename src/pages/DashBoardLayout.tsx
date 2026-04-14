import Layout from "../components/Layout";
import MainContent from "../components/MainContent";
import ModalBox from "../components/ModalBox";
import { createPortal } from "react-dom";
import { useState } from "react";
import AddIncomeForm from "../components/AddIncomeForm";
import AddNewCategoryForm from "../components/AddCategoryForm";

interface DashboardPropsType {
  onToggle: () => void;
  isOpen: boolean;
  isLoggedin: boolean;
}
const DashBoardLayout = ({ onToggle, isOpen }: DashboardPropsType) => {
  const [modalState, setModalState] = useState<
    "income" | "category" | "closed"
  >("closed");
  return (
    <div className="relative">
      <Layout onToggle={onToggle} isOpen={isOpen}>
        <>
          {modalState !== "closed" &&
            createPortal(
              <ModalBox
                isForm={modalState}
                form={
                  modalState === "income" ? (
                    <AddIncomeForm setModalState={setModalState} />
                  ) : (
                    <AddNewCategoryForm setModalState={setModalState} />
                  )
                }
                onClose={() => setModalState("closed")}
              />,
              document.body,
            )}
        </>
        <div className="">
          <MainContent setModalState={setModalState} />
        </div>
      </Layout>
    </div>
  );
};

export default DashBoardLayout;
