import { ChangeEvent, useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { User } from "firebase/auth";

export type UserType = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  currentUser: User | null;
};

type EntryType = {
  name: string;
  pass: string;
  err: boolean;
  loadings: boolean;
};

export const UserCabinet = () => {
  const [activInputName, setactivInputName] = useState(true);
  const [activInpuPass, setactivInputPass] = useState(true);
  const [userinfo, setUserinfo] = useState<UserType>({
    uid: "",
    email: "",
    displayName: "",
    photoURL: "",
    currentUser: null,
  });
  const navigate = useNavigate();

  const [entry, setEntry] = useState<EntryType>({
    name: "",
    pass: "",
    err: false,
    loadings: false,
  });

  // Получение данных пользователя
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserinfo({
          uid: user.uid ?? "",
          email: user.email ?? "",
          displayName: user.displayName ?? "",
          photoURL: user.photoURL ?? "",
          currentUser: user,
        });
      }
    });
  }, [auth]);

  // Выход из учетной записи
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  // Обработчик изменения имени
  const handleNameChange = () => {
    setactivInputName(!activInputName);

    if (!activInputName && userinfo.currentUser && entry.name) {
      updateProfile(userinfo.currentUser, { displayName: entry.name }).then(
        () => {
          navigate("/user");
          alert("Ваше имя изменено");
        },
      );
    }
  };

  // Инпуты логина и пароля
  const refName = useRef<HTMLInputElement | null>(null);
  const refPass = useRef<HTMLInputElement | null>(null);

  // ОБработчик ввода
  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };

  // задай интервал на изменение entry.loadings 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      if (entry.loadings) {
        setEntry({ ...entry, loadings: false });
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [entry.loadings]);

  // Обработчик изменения пароля
  const handlePassChange = () => {
    setactivInputPass(!activInpuPass);
    if (!activInpuPass && userinfo.currentUser && entry.pass) {
      updatePassword(userinfo.currentUser, entry.pass).then(() => {
        setEntry({ ...entry, loadings: true });
      });
    }
  };
  return (
    <>
      <h1 className="ml-[16px] desktop:ml-[0px] mb-[24px] text-[24px] desktop:text-[40px] desktop:leading-[44px] leading-[26.4px] font-bold ">
        Профиль
      </h1>
      <div className=" desktop:h-[257px] mx-auto mb-12 w-full max-w-[343px] rounded-3xl border bg-white p-6 shadow-lg sm:max-w-[453px] md:max-w-[600px] md:p-10 lg:max-w-[800px] lg:p-[30px] xl:max-w-[1160px] xl:gap-[10px]">
        <div className="flex flex-wrap gap-6 desktop:gap-[33px]">
          <div className="mx-auto flex items-center justify-center">
            <img
              src={auth.currentUser?.photoURL ?? "Mask group.svg"}
              className="desktop:w-[197px] w-[141px]  max-w-full justify-center rounded-[20px] md:w-[250px] lg:w-[300px]"
              alt="Profile"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="relative desktop:mb-[10px] mb-[20px] flex items-center gap-[12px]">
              <input
                ref={refName}
                name="name"
                onChange={inputChange}
                className={
                  activInputName
                    ? "w-[240px] border-none pb-3 pl-0 text-3xl font-bold placeholder-black"
                    : "w-[240px] pb-3 text-3xl font-bold"
                }
                type="text"
                placeholder={auth.currentUser?.displayName ?? "Гость"}
                readOnly={activInputName}
              />
              {activInputName && (
                <button
                  className="left-[100px] top-[18px]"
                  onClick={handleNameChange}
                >
                  ✏️
                </button>
              )}
              {!activInputName && (
                <button
                  className="left-[270px] text-[24px]"
                  onClick={handleNameChange}
                >
                  ✅
                </button>
              )}
            </div>

            <div className="desktop:mb-[6px] flex flex-col">
              <span className="font-small text-[18px]">
                Логин: {userinfo.email}
              </span>
            </div>

            <div className="font-small mb-[20px] flex items-center text-[18px]">
              <p>Пароль:</p>
              <input
                ref={refPass}
                name="pass"
                onChange={inputChange}
                className={
                  activInpuPass
                    ? "box-border h-[36px] w-[170px] border-none placeholder-black"
                    : "ml-[6px] box-border h-[36px] w-[170px]"
                }
                type="password"
                placeholder="••••••••"
                readOnly={activInpuPass}
              />
              {entry.loadings && (
                <p className="ml-[12px] animate-pulse font-bold text-btnPrimaryHover">
                  Готово 👌
                </p>
              )}
            </div>

            <div className="flex max-w-full flex-col items-center gap-[10px] md:flex-row">
              <button
                onClick={handlePassChange}
                className="buttonPrimary  w-full hover:bg-btnPrimaryHover active:bg-btnPrimaryActive disabled:bg-btnPrimaryInactive md:mb-0 md:w-[192px]"
              >
                {activInpuPass ? "Изменить пароль" : "Сохранить"}
              </button>
              <button
                onClick={handleLogout}
                className="buttonSecondary w-full border-[1px] border-solid border-black bg-white invalid:bg-btnSecondaryInactive hover:bg-btnSecondaryHover active:bg-btnSecondaryActive md:w-[192px]"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};