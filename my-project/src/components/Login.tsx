import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { auth } from "../firebase";
import Registry from "./Registry";

type EntryType = {
  email: string;
  pass: string;
  rePass: string;
  matchPasswords: boolean;
  isEmptyField: boolean;
};

const RestorePassword = ({ email }: Pick<EntryType, "email">) => {
  const { changeModal } = useModal();
  return (
    <>
      <div
        className="mt-12 text-center text-[18px]"
        onClick={() => changeModal("login")}
      >
        Ссылка для восстановления пароля отправлена на &nbsp;
        {email}
      </div>
    </>
  );
};

const EventToLogin = () => {
  const { changeModal } = useModal();

  return (
    <>
      <div className="mb-9 mt-12 text-center text-[18px]">
        Для добавления курса необходимо войти.
      </div>
      <button
        name="reg"
        className="buttonPrimary w-[278px] border-[1px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive"
        onClick={() => {
          changeModal("login");
        }}
      >
        Войти
      </button>
    </>
  );
};

type ReqPassword = {
  setEmail: (email: string) => void;
};

const Form = ({ setEmail }: ReqPassword) => {
  const refLogin = useRef<HTMLInputElement | null>(null);
  const refPass = useRef<HTMLInputElement | null>(null);
  const refBtn = useRef<HTMLButtonElement | null>(null);

  const { changeModal, changeOpenValue } = useModal();

  const [error, setError] = useState<string | null>(null);
  const [reqChangePass, setReqChangePass] = useState<string | null>(null);
  const [entry, setEntry] = useState<EntryType>({
    email: "",
    pass: "",
    rePass: "",
    matchPasswords: true,
    isEmptyField: false,
  });
  const { email, pass, matchPasswords, isEmptyField } = entry;

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
      matchPasswords: true,
      isEmptyField: false,
    });
  };

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !pass) {
      refBtn.current?.setAttribute("disabled", "");
      setEntry({ ...entry, isEmptyField: true });
      !email && refLogin.current?.classList.add("border-red-600");
      !pass && refPass.current?.classList.add("border-red-600");
      return;
    }

    if (
      !email.match(
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
      )
    ) {
      setError("Введите корректный адрес электронной почты");
      refLogin.current?.classList.add("border-red-600");
      return null;
    }

    if (isEmptyField) return null;

    try {
      await signInWithEmailAndPassword(auth, entry.email, entry.pass);
      changeOpenValue();
    } catch (err) {
      if (err instanceof Error) {
        if ("code" in err) {
          if (err.code === "auth/invalid-credential") {
            setError("Пароль введен неверно, попробуйте еще раз. ");
            setReqChangePass("Восстановить пароль?");
          } else {
            setError(err.message.replace("Firebase:", ""));
          }
        }
      }
    }
  };

  const restorePassword = () => {
    sendPasswordResetEmail(auth, email);
    changeModal("info");
    setEmail(email);
  };

  return (
    <form onSubmit={loginUser} noValidate>
      <div className="mt-12 flex flex-col gap-[10px]">
        <input
          ref={refLogin}
          type="email"
          name="email"
          onChange={inputChange}
          onFocus={() => {
            setEntry({ ...entry, isEmptyField: false });
            refLogin.current?.classList.remove("border-red-600");
            refBtn.current?.removeAttribute("disabled");
          }}
          placeholder="Логин"
          required
        />
        <input
          ref={refPass}
          type="password"
          name="pass"
          onChange={inputChange}
          onFocus={() => {
            setEntry({ ...entry, isEmptyField: false });
            refPass.current?.classList.remove("border-red-600");
            refBtn.current?.removeAttribute("disabled");
          }}
          placeholder="Пароль"
          required
        />
      </div>
      <div className="h-fit min-h-[34px] text-center">
        {isEmptyField && (
          <h3 className="err animate-err">Заполните все поля!</h3>
        )}
        {!matchPasswords && (
          <h3 className="err animate-err">Пароли не совпадают</h3>
        )}
        {error && (
          <h3 className="err inline-block animate-err align-middle text-[14px] leading-[15px] before:h-full before:content-['']">
            {error}
            {reqChangePass && (
              <span
                className="underLineText cursor-pointer"
                onClick={restorePassword}
              >
                {reqChangePass}
              </span>
            )}
          </h3>
        )}
      </div>
      <div className="m-0 flex flex-col gap-[10px] p-0">
        <button
          ref={refBtn}
          name="reg"
          className="buttonPrimary hover:bg-btnPrimaryHover active:bg-btnPrimaryActive disabled:bg-btnPrimaryInactive"
          type="submit"
        >
          Войти
        </button>
        <button
          name="reg"
          className="buttonSecondary w-[278px] border-[1px] border-solid border-black bg-white invalid:bg-btnSecondaryInactive hover:bg-btnSecondaryHover active:bg-btnSecondaryActive"
          onClick={() => {
            changeModal("registry");
          }}
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};

const Login = () => {
  const [email, setEmail] = useState<string>("");

  const { isOpen, changeOpenValue, kindOfModal } = useModal();

  if (!isOpen) return null;

  const handleEmail = (email: string) => {
    if (email) setEmail(email);
  };

  return (
    <div
      className="entry fixed left-0 top-0 z-50 h-full w-full min-w-[375px]"
      onClick={() => {
        changeOpenValue();
      }}
    >
      <div className="flex h-full w-full items-center justify-center bg-black/[.1]">
        <section
          className="flex h-fit min-h-[233px] w-[360px] flex-col items-center rounded-[30px] bg-white p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={"/"}>
            <img src="/skyFitness.svg" alt="logo" width={220} height={35} />
          </Link>
          {kindOfModal === "login" ? (
            <Form setEmail={handleEmail} />
          ) : kindOfModal === "registry" ? (
            <Registry />
          ) : kindOfModal === "info" ? (
            <RestorePassword email={email} />
          ) : (
            <EventToLogin />
          )}
        </section>
      </div>
    </div>
  );
};
export default Login;
