import { useContext } from "react";
import { UserContext } from "../providers/userProvider";

export const useModal = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
