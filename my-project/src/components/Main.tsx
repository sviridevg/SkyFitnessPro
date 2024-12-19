import Header from "./Header";
import Login from "./Login";
import TrainingList from "./TrainingList";
import { useModal } from "../hooks/useModal";


const Main = () => {
  const { isOpen } = useModal();
  return (
    <main className="flex flex-col items-center py-[50px]">
      <div className="min-h-[500px] min-w-[375px] max-w-[1160px]">
        <Header />
        <div className="mt-[40px] flex justify-between px-6 sm:px-0 desktop:mt-[60px]">
          <h1 className="h-[105px]  text-left text-[32px] font-medium leading-[35.2px] sm:h-[120px] sm:w-[850px] sm:text-[60px] sm:leading-[60px]">
            Начните заниматься спортом и улучшите качество жизни
          </h1>

          <div className="relative hidden h-[102px] max-w-[288px] rounded-[5px] bg-[#BCEC30] px-[20px] text-[32px] leading-[35px] desktop:py-[16px] 2xl:block">
            <p>Измени своё тело за полгода!</p>
            <img
              className="absolute bottom-[-24px] right-[140px]"
              src="Polygon 1.svg"
              alt="text"
            />
          </div>
        </div>
        <TrainingList />
        <div className="mt-[34px] flex desktop:justify-center justify-end mr-[16px]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="buttonPrimary h-[52px] w-[127px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive disabled:bg-btnPrimaryInactive"
          >
            Наверх ↑
          </button>
        </div>
      </div>
      {isOpen && <Login />}
    </main>
  );
};

export default Main;