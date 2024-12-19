import { useLocation, useNavigate } from "react-router-dom";
import UserHeaderItem from "./UserHeaderItem";

const Header = () => {
  const location: boolean = useLocation().pathname.includes("user") || useLocation().pathname.includes("task");
  const navigate = useNavigate();
  const handleGoToMainPage = () => {
    navigate("/");
  };

  return (
    <>
      <header className="just relative z-40 flex justify-between pl-[16px] pr-[16px] desktop:pl-[0px]  desktop:pr-[0px] ">
        <div onClick={handleGoToMainPage} className="cursor-pointer">
          <img src="/skyFitness.svg" alt="logo" width={220} height={35} />
          {!location && (
            <p className="mt-[16px] text-[18px] font-normal  leading-[19.8px] hidden text-[#00000050] lg:block">
              Онлайн-тренировки для занятий дома
            </p>
          )}
        </div>
        <UserHeaderItem />
      </header>
    </>
  );
};

export default Header;
