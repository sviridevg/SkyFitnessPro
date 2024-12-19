import { createContext, ReactNode, useState } from "react";

export type ModalType = {
  isOpen: boolean;
  kindOfModal: "login" | "registry" | "info" | "event";
  changeOpenValue: () => void;
  changeModal: (name: "login" | "registry" | "info" | "event") => void;
};

export const UserContext = createContext<ModalType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kindOfModal, setKindOfModal] = useState<
    "login" | "registry" | "info" | "event"
  >("login");

  const changeOpenValue = () => {
    setIsOpen(!isOpen);
  };
  const changeModal = (name: "login" | "registry" | "info" | "event") => {
    setKindOfModal(name);
  };

  return (
    <UserContext.Provider
      value={{ isOpen, changeOpenValue, kindOfModal, changeModal }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
