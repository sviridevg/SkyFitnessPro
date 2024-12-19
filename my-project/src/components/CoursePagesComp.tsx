import Header from "./Header";
import { useParams, useNavigate } from "react-router-dom";
import { HeroImage } from "./HeroImages";
import Login from "./Login";
import { auth, database } from "../firebase";
import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { useModal } from "../hooks/useModal";
import useWriteDataInBase from "../hooks/useWriteDataInBase";
import { courseProgress } from "./CourseProgress";
import { deleteCourseData } from "./DellCourse";

type TrainingItem = {
  _id: string | undefined;
  urlImg: string;
  trainType: string;
  nameRU: string;
  calendar: string;
  time: string;
  level: string;
  workouts: [];
  fitting: string[];
  directions: string[];
};

const ItemsComponent: React.FC<{ index: number; item: string }> = ({
  index,
  item,
}) => {
  return (
    <div
      key={index}
      className="flex h-[141px] w-[343px] items-center gap-x-[17px] rounded-[28px] bg-gradient-to-r from-[#151720] to-[#1E212E] p-[20px] first:h-[141px] desktop:mr-[8px] desktop:w-[370px]"
    >
      <p className="text-[75px] font-medium text-[#BCEC30]">{index + 1}</p>
      <p className="text-[20px] font-normal leading-[22.4px] text-white">
        {item}
      </p>
    </div>
  );
};

const ItemsComponentItem: React.FC<{ index: number; item: string }> = ({
  index,
  item,
}) => {
  return (
    <div key={index} className="flex sm:mb-0">
      <div className="flex items-center gap-x-[8px] sm:gap-x-[30px]">
        <img
          src="/star.svg"
          alt="logo"
          className="h-[19.5px] w-[19.5px] sm:h-[26px] sm:w-[26px]"
        />
        <p className="text-[18px] font-normal leading-[22px] text-black sm:text-[24px] sm:leading-[26.4px]">
          {item}
        </p>
      </div>
    </div>
  );
};

export const CoursePagesComp = () => {
  const params = useParams<{ nameEN: string | undefined }>();
  const { isOpen, changeOpenValue, changeModal } = useModal();
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const navigate = useNavigate();

  courseProgress(params.nameEN);

  const train = items.find(
    (item: TrainingItem) => item._id === params?.nameEN,
  ) as TrainingItem | undefined;

  const fittings: string[] = train ? train.fitting : [];
  const directions: string[] = train ? train.directions : [];

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsAuth(!!user);
      if (user) fetchUserCourses(user.uid);
    });
  }, []);

  const fetchUserCourses = async (uid: string) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя ", error);
    }
  };

  useEffect(() => {
    const dataRef = ref(database, "/courses");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data);
    });
  }, [database]);

  const handleAddCourse = async () => {
    if (auth.currentUser && params.nameEN) {
      await useWriteDataInBase(
        auth.currentUser.uid,
        params.nameEN,
        setUserCourses,
      );
      navigate("/user");
    } else {
      console.error(
        "Пользователь не авторизован или идентификатор курса отсутствует",
      );
    }
  };

  const isCourseAdded = params.nameEN
  ? userCourses.includes(params.nameEN)
  : false;

  const openModal = () => {
    changeModal("login");
    changeOpenValue();
  };

  const handleRemoveCourse = async () => {
    if (auth.currentUser && params.nameEN) {
      try {
        await deleteCourseData(params.nameEN);
        setUserCourses((prevCourses) => {
          const updatedCourses = prevCourses.filter(
            (course) => course !== params.nameEN
          );
          return updatedCourses;
        });
      } catch (error) {
        console.error("Ошибка при удалении курса:", error);
      }
    } else {
      console.error("Пользователь не авторизован или идентификатор курса отсутствует");
    }
  };
  

  return (
    <>
      <div className="max-width-[375px] flex flex-col items-center justify-center overflow-x-hidden py-[50px]">
        <div className="min-w-[375px] max-w-[1160px] desktop:overflow-visible">
          <Header />
          <div className="mt-[40px] w-[375px] px-[16px] desktop:mt-[60px] desktop:w-[1160px] desktop:px-[0px]">
            <HeroImage param={params.nameEN} />
            <p className="decoration-skip-ink-none mb-0 h-[26px] gap-0 text-left text-[24px] font-medium leading-[26.4px] text-black desktop:mb-[40px] desktop:mt-[60px] desktop:text-[40px] desktop:leading-[44px]">
              Подойдет для вас, если:
            </p>
            <div className="mt-[26px] flex h-[457px] flex-wrap justify-between sm:h-auto">
              {fittings.map((item, index) => (
                <ItemsComponent item={item} index={index} key={index} />
              ))}
            </div>

            <div className="relative">
              <p className="mb-[24px] mt-[40px] text-left font-['Roboto'] text-[24px] font-medium leading-[26.4px] text-black sm:text-[44px] desktop:text-[40px] desktop:leading-[44px]">
                Направления
              </p>

              <div className="box-border grid h-auto w-[343px] grid-cols-1 gap-[30px] rounded-[28px] bg-btnPrimaryRegular p-[30px] sm:h-[336px] sm:w-[1160px] sm:grid-cols-3 desktop:h-[146px] desktop:w-[1160px] desktop:content-center">
                {directions.map((item, index) => (
                  <ItemsComponentItem item={item} index={index} key={index} />
                ))}
              </div>
              <div className="relative">
                <img
                  className="left-[-40px] mx-auto mt-[30px] w-[900px] desktop:hidden"
                  src="/vector_6084.png"
                  alt="overlay"
                  width={300}
                  height={100}
                />

                <img
                  className="absolute left-[80px] right-0 top-[-120px] mx-auto desktop:hidden"
                  src="/forestGump.png"
                  alt="logo"
                  width={505}
                  height={100}
                />
              </div>
            </div>

            <div className="relative mb-[290px] w-[375px] desktop:mb-[0px] desktop:mt-[105px]">
              <div className="shadowBlack013 absolute top-[-100px] box-border flex h-[412px] w-[343px] rounded-[30px] bg-white bg-[right_55px_top_120px] bg-no-repeat p-[30px] desktop:hidden desktop:h-[486px] desktop:w-[1160px]">
                <div className="mb-[40px]">
                  <p className="mb-[28px] text-[32px] font-semibold leading-[35.2px] text-black desktop:text-[60px] desktop:leading-[60px]">
                    Начните путь <br /> к новому телу
                  </p>
                  <ul className="mb-[28px] pl-[20px] text-[18px] leading-[19.8px] desktop:text-[24px] desktop:leading-[28px]">
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      проработка всех групп мышц
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      тренировка суставов
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      улучшение циркуляции крови
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      упражнения заряжают бодростью
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      помогают противостоять стрессам
                    </li>
                  </ul>
                  {isAuth ? (
                    isCourseAdded ? (
                      <button
                        className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                        onClick={handleRemoveCourse}
                      >
                        Удалить курс
                      </button>
                    ) : (
                      <button
                        className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                        onClick={handleAddCourse}
                      >
                        Добавить курс
                      </button>
                    )
                  ) : (
                    <button
                      className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                      onClick={openModal}
                    >
                      Войдите, чтобы добавить курс
                    </button>
                  )}

                </div>
              </div>
              <div className="shadowBlack013 relative box-border flex hidden h-[486px] w-[1160px] rounded-[30px] bg-white bg-[url(/vector_6084.png)] bg-[right_55px_top_120px] bg-no-repeat p-[40px] desktop:block">
                <div className="pb-[40px]">
                  <p className="mb-[28px] text-[60px] font-semibold leading-[60px] text-black">
                    Начните путь <br /> к новому телу
                  </p>
                  <ul className="mb-[28px] pl-[20px] text-[18px] leading-[19.8px] desktop:text-[24px] desktop:leading-[28px]">
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      проработка всех групп мышц
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      тренировка суставов
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      улучшение циркуляции крови
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      упражнения заряжают бодростью
                    </li>
                    <li className="corPageTextBlack06 mb-[10px] list-disc">
                      помогают противостоять стрессам
                    </li>
                  </ul>
                  {isAuth ? (
                    isCourseAdded ? (
                      <button
                        className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                        onClick={handleRemoveCourse}
                      >
                        Удалить курс
                      </button>
                    ) : (
                      <button
                        className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                        onClick={handleAddCourse}
                      >
                        Добавить курс
                      </button>
                    )
                  ) : (
                    <button
                      className="buttonPrimary w-[283px] hover:bg-btnPrimaryHover active:bg-btnPrimaryActive desktop:w-[437px]"
                      onClick={openModal}
                    >
                      Войдите, чтобы добавить курс
                    </button>
                  )}

                </div>
                <img
                  className="absolute bottom-5 right-10"
                  src="/forestGump.png"
                  alt="logo"
                  width={505}
                  height={100}
                />
              </div>
            </div>
            {isOpen && <Login />}
          </div>
        </div>
      </div>
    </>
  );
};
