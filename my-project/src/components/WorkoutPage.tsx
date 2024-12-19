import Header from "./Header";
import MyProgressPopup from "./MyProgressPopup";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";
import { useParams } from "react-router";
import { auth } from "../firebase";

type Exercise = {
  name: string;
  quantity: number;
};

type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises?: Exercise[];
};

type UserExercises = {
  [exerciseId: string]: number;
};

type UserWorkoutProgress = {
  [workoutId: string]: UserExercises;
};

type Course = {
  _id: string;
  nameRU: string;
  workouts: string[];
};

export const WorkoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const [userExers, setUserExers] = useState<Workout[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userExercises, setUserExercises] = useState<UserWorkoutProgress>({});

  const uid = auth.currentUser?.uid;

  // Загрузка тренировок пользователя
  useEffect(() => {
    if (uid) {
      const userExRef = ref(database, `users/${uid}/userExercises`);
      onValue(userExRef, (snapshot) => {
        const data = snapshot.val() || [];

        // Преобразование массива в объект
        const formattedData = Array.isArray(data)
          ? data.reduce(
              (
                acc: UserWorkoutProgress,
                item: Record<string, UserExercises>,
              ) => {
                const [workoutId, exercises] = Object.entries(item)[0];
                acc[workoutId] = exercises;
                return acc;
              },
              {},
            )
          : (data as UserWorkoutProgress);

        setUserExercises(formattedData);
      });
    }
  }, [uid]);

  // Загрузка тренировок
  useEffect(() => {
    const dataRef = ref(database, "/workouts");
    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const workoutsArray = Object.values(data) as Workout[];
        setUserExers(workoutsArray);
        setIsLoading(false);
      },
      (error) => {
        console.error("Ошибка загрузки данных:", error);
        setIsLoading(false);
      },
    );
  }, []);

  // Загрузка курсов
  useEffect(() => {
    const coursesRef = ref(database, "/courses");
    onValue(
      coursesRef,
      (snapshot) => {
        const data = snapshot.val() || [];
        const coursesArray = Object.values(data) as Course[];
        setCourses(coursesArray);
      },
      (error) => {
        console.error("Ошибка загрузки курсов:", error);
      },
    );
  }, []);

  // Проверка на наличие id
  if (!id) {
    return <p>ID тренировки не определен</p>;
  }

  const currentWorkout: Workout | undefined = userExers.find(
    (workout) => workout._id === id,
  );

  // Получение названия курса
  const courseName =
    courses.find((course) => course.workouts.includes(id || ""))?.nameRU ||
    "Название курса отсутствует";

  const calculateProgress = (
    exerciseIndex: number,
    quantity: number,
  ): number => {
    const exerciseKey = `ex_${exerciseIndex + 1}`;
    const completed = userExercises[id]?.[exerciseKey] || 0;
    const progress = Math.floor((completed / quantity) * 100);
    return progress;
  };

  if (
    isLoading ||
    Object.keys(userExercises).length === 0 ||
    !userExercises[id]
  ) {
    return <p>Загрузка данных...</p>;
  }

  if (!currentWorkout) {
    return <p>Тренировка не найдена.</p>;
  }

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-[375px] py-[50px] desktop:w-[1160px]">
        <Header />
        <main className="">
          <section className="px-[16px] desktop:px-[0px]">
            <h1 className="mb-[10px] mt-[40px] text-[24px] font-medium desktop:mb-6 desktop:text-[60px]">
              {courseName}
            </h1>
            <h3 className="text-[18px] leading-[19.8px] desktop:text-[32px] desktop:leading-[35.2px] desktop:underline">
              {currentWorkout?.name || "Название отсутствует"}
            </h3>
            {currentWorkout && (
              <>
                <iframe
                  className="my-6 aspect-video h-auto w-full max-w-full rounded-[8.87px] desktop:my-[40px] desktop:rounded-3xl"
                  src={currentWorkout.video}
                  title={currentWorkout.name}
                  width="600"
                  height="400"
                  allowFullScreen
                ></iframe>
              </>
            )}
          </section>
          <div className="mb-[84px] rounded-[30px] shadow-[0px_4px_67px_-12px_#00000021] desktop:mb-[200px] desktop:rounded-3xl">
            <section className="p-[30px] desktop:p-[40px]">
              {isLoading ? (
                <p>Загрузка упражнений...</p>
              ) : currentWorkout?.exercises?.length ? (
                <>
                  <h2 className="text-[32px] leading-[35.2px]"> Упражнения </h2>
                  <ul className="flex grid-cols-3 flex-col gap-6 pt-5 desktop:grid desktop:gap-x-[20px]">
                    {currentWorkout.exercises.map((exercise, index) => (
                      <li key={index} className="flex flex-col">
                        <label
                          className="pb-[10px] text-[18px] leading-[19.8px] desktop:text-lg"
                          htmlFor=""
                        >
                          {exercise.name}{" "}
                          {calculateProgress(index, exercise.quantity)}%
                        </label>
                        <progress
                          className="h-[6px] w-[283px] desktop:w-80 [&::-moz-progress-bar]:bg-[#00C1FF] [&::-webkit-progress-bar]:rounded-3xl [&::-webkit-progress-bar]:bg-[#F7F7F7] [&::-webkit-progress-value]:rounded-3xl [&::-webkit-progress-value]:bg-[#00C1FF]"
                          id="progress"
                          value={userExercises[id]?.[`ex_${index + 1}`] || 0}
                          max={exercise.quantity}
                        ></progress>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>
                  После завершения упражнения, не забудьте оценить, как прошла
                  ваша тренировка. <br />
                  Это важно для точного подсчета вашего прогресса!
                </p>
              )}
              <button
                onClick={openPopup}
                className="mt-10 h-[52px] w-[283px] rounded-full bg-[#BCEC30] text-lg hover:bg-[#C6FF00] active:bg-black active:text-white desktop:w-80"
              >
                {currentWorkout?.exercises?.length ? (
                  <p>Заполнить свой прогресс</p>
                ) : (
                  <p>Оцените тренировку</p>
                )}
              </button>
            </section>
          </div>
        </main>
      </div>
      {isPopupVisible && (
        <MyProgressPopup onClose={closePopup} workoutId={id} />
      )}
    </div>
  );
};

export default WorkoutPage;
