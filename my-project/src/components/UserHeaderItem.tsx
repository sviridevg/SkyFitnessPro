import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { HeaderUserPopUp } from "./HeaderPopUp";
import { useModal } from "../hooks/useModal";
import { onAuthStateChanged } from "firebase/auth";

function UserHeaderItem() {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { changeOpenValue, changeModal } = useModal();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  const openModal = () => {
    changeModal("login");
    changeOpenValue();
  };

  const togglePopup = () => {
    setPopupOpen((prev) => !prev);
  };

  return (
    <>
      {isAuth ? (
        <div className="flex items-center">
          <div
            onClick={() => togglePopup()}
            className="flex cursor-pointer items-center"
          >
            <img
              className="mr-[12px] h-[36px] w-[36px] rounded-[46px] desktop:h-[42px] desktop:w-[42px]"
              src={auth.currentUser?.photoURL ?? "/profile.svg"}
              alt="logo"
            />
            <p className="ml-[16px] mr-[12px] hidden select-none font-[roboto] text-[24px] font-normal sm:block">
              {auth.currentUser?.displayName ?? "Гость"}
            </p>
            <img src="/rectangle_3765.svg" alt="logo" width={14} height={11} />
          </div>
        </div>
      ) : (
        <button
          onClick={openModal}
          className="buttonPrimaryMobile hover:buttonPrimaryMobile active:buttonPrimaryMobile desktop:buttonPrimary h-[36px] w-[83px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive disabled:bg-btnPrimaryInactive desktop:h-[52px] desktop:w-[103px]"
        >
          Войти
        </button>
      )}
      {popupOpen && (
        <div className="box absolute right-[0px] top-[70px] z-50">
          <HeaderUserPopUp setPopupOpen={setPopupOpen} />
        </div>
      )}
    </>
  );
}

export default UserHeaderItem;
