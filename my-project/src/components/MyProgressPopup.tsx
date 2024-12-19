import { useEffect, useState } from "react";
import ProgressSuccess from "./ProgressSuccess";
import { auth, database } from "../firebase";
import { get, onValue, ref, update } from "firebase/database";

interface MyProgressPopupProps {
  onClose: () => void;
  workoutId?: string;
}

interface Exercise {
  name: string;
  quantity: number;
}

interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises?: Exercise[];
}

interface WorkoutItem {
  name: string;
  quantity: number;
}

interface UserExercise {
  [workoutId: string]: {
    [exerciseKey: string]: number;
  };
}

interface UserData {
  _id: string;
  courses: string[];
  userExercises: UserExercise[];
}

function MyProgressPopup({ onClose, workoutId }: MyProgressPopupProps) {
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(true);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState<boolean>(false);
  const [userExers, setUserExers] = useState<Workout[]>([]);

  useEffect(() => {
    const dataRef = ref(database, "/workouts");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || [];
      setUserExers(data);
    });
  }, []);

  // Найдем текущую тренировку по id
  const currentWorkout: Workout | undefined = userExers.find(
    (workout) => workout._id === workoutId
  );

  // Сохраним упражнения текущей тренировки
  const exercises: WorkoutItem[] = currentWorkout?.exercises || [];

  // Если упражнения есть, сохраняем их названия, если нет — предложим оценить тренировку
  const exersiseNames =
    exercises.length > 0
      ? exercises.map((exercise) => exercise.name)
      : currentWorkout
      ? ["Оцените тренировку от 1 до 5"]
      : [];

  const [values, setValues] = useState<{ [key: string]: number }>(
    exersiseNames.reduce(
      (acc, _, index) => {
        acc[`ex_${index + 1}`] = 0;
        return acc;
      },
      {} as { [key: string]: number }
    )
  );

  // Обработчик изменения ввода
  const handleInputChange = (key: string, newValue: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: isNaN(newValue) ? 0 : newValue,
    }));
  };

  // Обновляем данные в ФБ
  const handleUpdate = async () => {
    try {
      const userRef = ref(database, `users/${auth.currentUser?.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData: UserData = snapshot.val();

        const updatedExercises = userData.userExercises.map((exercise) => {
          if (exercise[workoutId!]) {
            return {
              ...exercise,
              [workoutId!]: {
                ...exercise[workoutId!],
                ...values,
              },
            };
          }
          return exercise;
        });

        await update(userRef, {
          userExercises: updatedExercises,
        });
      } else {
        console.error("Данные пользователя не найдены");
      }
    } catch (error) {
      console.error("Ошибка обновления данных", error);
    }
  };

  const handleSave = () => {
    setIsPopupVisible(false);
    setIsSuccessPopupVisible(true);
    handleUpdate();
    setTimeout(() => {
      setIsSuccessPopupVisible(false);
      onClose();
    }, 2000);
  };

  return (
    <>
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <div className="relative z-10 w-[426px] rounded-[30px] bg-white p-10 shadow-lg">
            <h2 className="mb-4 text-3xl font-semibold">Мой прогресс</h2>
            <form className="max-h-[380px] w-full max-w-[346px] overflow-auto">
              {exersiseNames.map((item, i) => (
                <div
                  key={i}
                  className="mb-4 flex w-full max-w-[320px] flex-col"
                >
                  <label className="mb-2 text-lg">{item}</label>
                  <input
                    type="text"
                    value={values[`ex_${i + 1}`] ?? ""}
                    onChange={(e) =>
                      handleInputChange(`ex_${i + 1}`, Number(e.target.value))
                    }
                    placeholder="0"
                    className="rounded-lg border-[1px] border-solid border-borderInputPrimary px-[18px] py-3"
                  />
                </div>
              ))}
            </form>
            <button
              className="buttonPrimary mt-4 w-full rounded rounded-full bg-btnPrimaryRegular px-4 py-2 hover:bg-btnPrimaryHover active:bg-btnPrimaryActive active:text-white disabled:bg-btnPrimaryInactive"
              onClick={handleSave}
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {isSuccessPopupVisible && <ProgressSuccess />}
    </>
  );
}

export default MyProgressPopup;
