import { getDatabase, ref, get, set } from "firebase/database";
import { auth, database } from "../firebase";

type TrainingItem = {
  _id: string;
  urlImg: string;
  trainType: string;
  nameRU: string;
  calendar: string;
  time: string;
  level: string;
  workouts: string[];
  fitting: string[];
  directions: string[];
};

type UserEx = { [workoutId: string]: { [exerciseId: string]: number } };

const deleteCourseData = async (courseId: string) => {
  try {
    const db = getDatabase();

    // Проверка авторизации
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("Ошибка: пользователь не авторизован.");
      return;
    }

    // Ссылки на данные пользователя
    const coursesRef = ref(db, `users/${userId}/courses`);
    const userExercisesRef = ref(db, `users/${userId}/userExercises`);
    const allCoursesRef = ref(database, "/courses");

    // Получение данных из базы
    const [coursesSnapshot, userExercisesSnapshot, allCoursesSnapshot] =
      await Promise.all([
        get(coursesRef),
        get(userExercisesRef),
        get(allCoursesRef),
      ]);

    if (!coursesSnapshot.exists()) {
      console.warn("Курсы отсутствуют в базе.");
      return;
    }
    if (!userExercisesSnapshot.exists()) {
      console.warn("Упражнения отсутствуют в базе.");
      return;
    }
    if (!allCoursesSnapshot.exists()) {
      console.warn("Данные курсов отсутствуют в базе.");
      return;
    }

    const courses = coursesSnapshot.val(); 
    const userExercises = userExercisesSnapshot.val(); 
    const allCourses = allCoursesSnapshot.val(); 

    // Создаём объект с тренировками для каждого курса
    const courseWithWorkouts: { [key: string]: string[] } = {};
    allCourses.forEach((course: TrainingItem) => {
      courseWithWorkouts[course._id] = course.workouts || [];
    });

    // Получаем тренировки 
    const workoutsToDeleteIds = courseWithWorkouts[courseId] || [];

    if (workoutsToDeleteIds.length === 0) {
      console.warn("Нет тренировок, связанных с указанным курсом.");
      return;
    }

    console.log(courseWithWorkouts);

    // Преобразование массива упражнений в объект
    const exercisesArrayToObject = (array: Array<UserEx>) => {
      console.log(array);
      return array.reduce((acc, item) => {
        const [key, value] = Object.entries(item)[0];
        acc[key] = value;
        return acc;
      }, {});
    };

    const exercisesObject = Array.isArray(userExercises)
      ? exercisesArrayToObject(userExercises)
      : userExercises;

    // Удаление объектов тренировок 
    workoutsToDeleteIds.forEach((workoutId) => {
      if (exercisesObject[workoutId]) {
        delete exercisesObject[workoutId];
      }
    });

    // Преобразуем объект обратно в массив
    const updatedUserExercises = Object.entries(exercisesObject).map(
      ([key, value]) => ({ [key]: value }),
    );

    // Удаление курса 
    const updatedCourses = courses.filter(
      (course: string) => course !== courseId,
    );

    await Promise.all([
      set(coursesRef, updatedCourses), 
      set(userExercisesRef, updatedUserExercises),
    ]);
  } catch (error) {}
};

export { deleteCourseData };
