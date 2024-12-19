import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { User } from "firebase/auth";

type popUpType = {
  setPopupOpen: (isOpen: boolean) => void;
};

export const HeaderUserPopUp = ({ setPopupOpen }: popUpType) => {
  const user: User | null = auth.currentUser;
  const email: string | null = user?.email ?? null;
  const name: string | null = user?.displayName ?? null;

  const navigate = useNavigate();

  const handleOpenUserPage = () => {
    navigate("/user");
    setPopupOpen(false);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    setPopupOpen(false);
  };


  return (
    <div className="shadowBlack013 box-border flex h-[258px] w-[266px] flex-col items-center rounded-[30px] bg-white p-[30px]">
      <p className="text-[18px] font-normal leading-[19.8px] text-black">
        {name}
      </p>
      <p className="mt-[10px] text-[18px] font-normal leading-[19.8px] text-[#999999]">
        {email}
      </p>

      <div className="mt-[34px] flex flex-col gap-[10px]">
        <button
          onClick={handleOpenUserPage}
          className="buttonPrimary w-[206px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive disabled:bg-btnPrimaryInactive"
        >
          Мой профиль
        </button>
        <button
          onClick={handleLogout}
          className="buttonSecondary w-[206px] border-[1px] border-solid border-black bg-white invalid:bg-btnSecondaryInactive hover:bg-btnSecondaryHover active:bg-btnSecondaryActive"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
