import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { ref, get, onValue } from "firebase/database";

interface WorkoutOption {
  _id: string;
  name: string;
  description: string;
}

interface Course {
  _id: string;
  workouts: string[];
}

interface WorkoutSelectPopupProps {
  courseId: string;
  onClose: () => void;
}

type AllWorkoutsType = {
  _id: string;
  exercises?: {
    name: string;
    quantity: number;
  }[];
};

type UserEx = { [workoutId: string]: { [exerciseId: string]: number } };

const WorkoutSelectPopup: React.FC<WorkoutSelectPopupProps> = ({
  courseId,
  onClose,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [workoutOptions, setWorkoutOptions] = useState<WorkoutOption[]>([]);
  const [userEx, setUserEx] = useState<UserEx[]>([]);
  const [workouts, setWorkouts] = useState<AllWorkoutsType[]>([]);
  const [workoutstatus, setWorkoutstatus] = useState<
    "begin" | "continue" | "newly"
  >("begin");

  const popupRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const calculateWorkoutStatus = (
    lessonId: string,
  ): "begin" | "continue" | "newly" => {
    const matchingItem = userEx.find((item) => lessonId in item);

    if (!matchingItem) return "begin";

    const progressData = Object.values(matchingItem[lessonId] || {});
    const totalProgress = progressData.reduce((sum, value) => sum + value, 0);

    const totalQuantity =
      workouts
        .find((workout) => workout._id === lessonId)
        ?.exercises?.reduce((sum, exercise) => sum + exercise.quantity, 0) || 1;

    if (totalProgress === 0) return "begin";
    if (totalProgress > 0 && totalProgress < totalQuantity) return "continue";
    if (totalProgress === totalQuantity) return "newly";
    return "newly";
  };

  const handleSelection = (id: string) => {
    setSelectedWorkout(id);
    const status = calculateWorkoutStatus(id);
    setWorkoutstatus(status);
  };

  const handleStart = () => {
    if (selectedWorkout) {
      navigate(`/task/${selectedWorkout}`);
      onClose();
    }
  };

  useEffect(() => {
    const fetchFilteredWorkouts = async () => {
      try {
        const coursesRef = ref(database, "courses");
        const coursesSnapshot = await get(coursesRef);
        const allCoursesData = coursesSnapshot.val() as Record<
          string,
          Course
        > | null;

        const courseData = Array.isArray(allCoursesData)
          ? allCoursesData.find((course) => course._id === courseId)
          : allCoursesData?.[courseId];

        if (!courseData || !Array.isArray(courseData.workouts)) {
          console.error(
            `Курс с courseId: ${courseId} не найден или workouts отсутствуют.`,
            courseData,
          );
          setWorkoutOptions([]);
          return;
        }

        const workoutKeys = courseData.workouts;

        const workoutsRef = ref(database, "workouts");
        const workoutsSnapshot = await get(workoutsRef);
        const allWorkoutsData = workoutsSnapshot.val() as Record<
          string,
          WorkoutOption
        > | null;

        if (!allWorkoutsData) {
          console.error("Нет данных для тренировок в базе данных.");
          setWorkoutOptions([]);
          return;
        }

        const workoutsArray = Object.values(allWorkoutsData) as WorkoutOption[];
        const filteredWorkouts = workoutsArray
          .filter((workout) => workoutKeys.includes(workout._id))
          .sort(
            (a, b) => Number(a.name.match(/\d+/)) - Number(b.name.match(/\d+/)),
          );

        setWorkoutOptions(filteredWorkouts);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setWorkoutOptions([]);
      }
    };

    fetchFilteredWorkouts();
  }, [courseId]);

  useEffect(() => {
    const dataUsEx = ref(
      database,
      `users/${auth.currentUser?.uid}/userExercises`,
    );
    onValue(dataUsEx, (snapshot) => {
      const data = snapshot.val() as UserEx[] | null;

      setUserEx(data || []);
    });
  }, []);

  // Загрузка данных о тренировках
  useEffect(() => {
    const dataRef = ref(database, "/workouts");
    onValue(dataRef, (snapshot) => {
      const data: AllWorkoutsType[] = snapshot.val() || [];
      setWorkouts(data);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const isButtonDisabled = !selectedWorkout;

  const buttonText = !selectedWorkout
    ? "Выберите тренировку"
    : workoutstatus === "begin"
      ? "Начать"
      : workoutstatus === "continue"
        ? "Продолжить"
        : workoutstatus === "newly"
          ? "Начать заново"
          : "";

  const handleButtonClick = () => {
    if (!selectedWorkout) return;
    handleStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={popupRef} className="w-[460px] rounded-[30px] bg-white p-10">
        <h2 className="mb-4 text-center text-3xl font-normal">
          Выберите тренировку
        </h2>
        <form className="mb-12 mt-12 max-h-[450px] w-full max-w-[400px] overflow-auto">
          <ul>
            {workoutOptions.map((workout) => {
              const [mainTitle, subtitle] = workout.name.split(" / ");
              const status = calculateWorkoutStatus(workout._id);

              const getCheckboxStyles = () => {
                switch (status) {
                  case "begin":
                    return "bg-gray-300";
                  case "continue":
                    return "bg-[url('../continue.svg')] bg-cover";
                  case "newly":
                    return "bg-white bg-[url('../checked.svg')]";
                  default:
                    return "bg-gray-300";
                }
              };

              return (
                <li
                  key={workout._id}
                  className="flex cursor-pointer items-center justify-between border-b p-3 hover:bg-gray-100 has-[:checked]:bg-gray-200"
                  onClick={() => handleSelection(workout._id)}
                >
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="workout"
                        value={workout._id}
                        checked={selectedWorkout === workout._id}
                        readOnly
                        className="peer hidden"
                      />
                      <span
                        className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${getCheckboxStyles()}`}
                      ></span>
                      <div>
                        <p className="cursor-pointer text-2xl">{mainTitle}</p>
                        <p className="text-base text-gray-600">{subtitle}</p>
                      </div>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </form>
        <button
          onClick={handleButtonClick}
          className={`buttonPrimary mt-4 w-full rounded-[46px] ${
            isButtonDisabled
              ? "cursor-not-allowed bg-btnPrimaryInactive"
              : "bg-btnPrimaryRegular hover:bg-btnPrimaryHover active:bg-btnPrimaryActive"
          }`}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default WorkoutSelectPopup;
