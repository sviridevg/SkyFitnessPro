import { useState, useEffect } from "react";
import Header from "./Header";
import { UserCabinet } from "./User";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import { MainCardsImage } from "./MainCardsImage";
import WorkoutSelectPopup from "./WorkoutSelectPopup";
import { courseProgress } from "./CourseProgress";
import { deleteCourseData } from "./DellCourse";

type Course = {
  _id: string;
  nameRU: string;
  workouts: { id: number; name: string }[];
  time: string;
  level: string;
  progress: number;
};

type MyCoursesProps = {
  userCourses: Course[];
  setSelectedCourseId: (id: string | null) => void;
  setShowWorkoutPopup: (show: boolean) => void;
};

const MyCorses = ({
  userCourses,
  setSelectedCourseId,
  setShowWorkoutPopup,
}: MyCoursesProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleMouseDown = (id: string) => {
    setActiveButton(id);
  };

  const handleMouseUp = () => {
    setActiveButton(null);
  };

  const handleWorkoutButtonClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowWorkoutPopup(true);
  };

  function dayTitle(number: number): string {
    if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return "дней";
    const lastNum = number % 10;
    if (lastNum === 1) return "День";
    if ([2, 3, 4].includes(lastNum)) return "Дня";
    return "Дней";
  }

  const handleDeleteCourse = (courseId: string) => {
    deleteCourseData(courseId).finally(() => {
      window.location.reload();
    });
  };

  return (
    <div className="mt-[34px] flex flex-wrap justify-center gap-[20px] sm:justify-start sm:gap-[30px] lg:gap-[40px] desktop:mt-[50px]">
      {userCourses.length > 0 ? (
        userCourses.map((course) => {
          const progress = courseProgress(course._id);
          return (
            <div
              key={course._id}
              className="relative h-[649px] w-[343px] rounded-[30px] bg-[white] shadow-[0px_4px_67px_-12px_#00000021] desktop:w-[360px]"
            >
              <button
                className="group absolute right-[20px] top-[20px] cursor-[url(coursor.svg),_pointer]"
                onClick={() => handleDeleteCourse(course._id)}
              >
                <img
                  src="/remove-in-Circle.svg"
                  alt="minus"
                  width={32}
                  height={32}
                />
                <div className="absolute left-[43px] top-[45px] z-10 hidden w-[102px] rounded-[5px] border-[0.5px] border-black bg-white pb-[4px] pl-[6px] text-left group-hover:block">
                  <p className="mt-1 text-sm">Удалить курс</p>
                </div>
              </button>
              <MainCardsImage param={course._id} />

              <div className="px-[30px] py-[24px]">
                <h3 className="mb-[20px] text-3xl font-medium">
                  {course.nameRU}
                </h3>
                <ul className="flex flex-wrap gap-[6px]">
                  <li className="flex items-center gap-[7.5px] rounded-[50px] bg-btnPrimaryInactive p-[10px] text-base">
                    <img src="/calendar.svg" alt="" />
                    {course.workouts.length} {dayTitle(course.workouts.length)}
                  </li>
                  <li className="flex items-center gap-[7.5px] rounded-[50px] bg-btnPrimaryInactive p-[10px] text-base">
                    <img src="/time.svg" alt="" />
                    {course.time}
                  </li>
                  <li className="flex items-center gap-[7.5px] rounded-[50px] bg-btnPrimaryInactive p-[10px] text-base">
                    <img src="/level.svg" alt="" />
                    {course.level}
                  </li>
                </ul>
                <div className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс: {progress}%</span>
                  </div>
                  <div className="h-2 rounded bg-gray-200">
                    <div
                      className="h-full rounded bg-blue-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  className={`mb-[15px] mt-[40px] h-[52px] w-full rounded-full bg-btnPrimaryRegular hover:bg-btnPrimaryHover active:bg-btnPrimaryActive ${
                    activeButton === course._id ? "text-white" : "text-black"
                  }`}
                  onMouseDown={() => handleMouseDown(course._id)}
                  onMouseUp={handleMouseUp}
                  onClick={() => handleWorkoutButtonClick(course._id)}
                >
                  {progress === 0 && "Начать тренировки"}
                  {progress === 100 && "Начать заново"}
                  {progress >= 1 && progress <= 99 && "Продолжить"}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>У вас пока нет добавленных курсов.</p>
      )}
    </div>
  );
};

export const Profile = () => {
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showWorkoutPopup, setShowWorkoutPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCourses = async (uid: string) => {
      try {
        const userCoursesRef = ref(database, `users/${uid}/courses`);
        const coursesSnapshot = await get(userCoursesRef);

        if (coursesSnapshot.exists()) {
          const courseIDs: string[] = coursesSnapshot.val();

          const allCoursesRef = ref(database, "courses");
          const allCoursesSnapshot = await get(allCoursesRef);
          const allCoursesData = allCoursesSnapshot.exists()
            ? allCoursesSnapshot.val()
            : [];

          const allCourses: Course[] = Array.isArray(allCoursesData)
            ? allCoursesData
            : Object.values(allCoursesData);

          const userCoursesData = allCourses.filter((course) =>
            courseIDs.includes(course._id),
          );

          const processedUserCourses = userCoursesData.map((course) => ({
            ...course,
            calendar: "30 дней",
            time: "20-50 мин/день",
            level: "Сложность",
          }));

          setUserCourses(processedUserCourses);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initialize = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await fetchUserCourses(user.uid);
        } else {
          setIsLoading(false);
        }
      });
    };

    initialize();
  }, [database]);

  return (
    <div className="relative flex flex-col items-center py-[50px]">
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center flex-col bg-white bg-opacity-50 ">
          
          <p className="text-xl font-bold text-gray-700 animate-pulse">Загрузка данных...</p>
          <img src="/wait.svg" alt="Ожидание" className="w-[350px] animate-pulse"/>
        </div>
      ) : (
        <div className="min-w-[375px] desktop:w-[1160px]">
          <Header />
          <div className="mt-14">
            <UserCabinet />
            <h1 className="mb-[24px] ml-[16px] text-[24px] font-bold leading-[26.4px] desktop:ml-[0px] desktop:text-[40px] desktop:leading-[44px]">
              Мои курсы
            </h1>
            <MyCorses
              userCourses={userCourses}
              setSelectedCourseId={setSelectedCourseId}
              setShowWorkoutPopup={setShowWorkoutPopup}
            />
          </div>
        </div>
      )}{" "}
      {showWorkoutPopup && selectedCourseId && (
        <WorkoutSelectPopup
          courseId={selectedCourseId}
          onClose={() => setShowWorkoutPopup(false)}
        />
      )}
    </div>
  );
};
