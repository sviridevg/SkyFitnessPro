import { MainCardsImage } from "./MainCardsImage";
import Tags from "./Tags";
import { useNavigate } from "react-router-dom";

import { useModal } from "../hooks/useModal";

import useWriteDataInBase from "../hooks/useWriteDataInBase";
import { auth, database } from "../firebase";
import { useState } from "react";
import { get, ref } from "firebase/database";

export type Component = {
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

//список занятий пользователя
const TrainingItem: React.FC<{ train: Component }> = ({ train }) => {
  const navigate = useNavigate();
  const { changeOpenValue, changeModal } = useModal();
  const [, setUserCourses] = useState<string[]>([]);

  const handleClickAddTrain = async () => {
    if (auth.currentUser && train._id) {
      fetchUserCourses(auth.currentUser.uid);
      await useWriteDataInBase(auth.currentUser.uid, train._id, setUserCourses);
      navigate("/user");
    } else {
      changeModal("event");
      changeOpenValue();
    }
  };

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

  const handleClick = () => {
    navigate(`/course/${train._id}`);
  };

  function dayTitle(number: number) {
    let lastNum;
    if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return "дней";
    lastNum = number % 10;
    if (lastNum == 1) return "День";
    if ([2, 3, 4].includes(lastNum)) return "Дня";
    if ([5, 6, 7, 8, 9, 0].includes(lastNum)) return "Дней";
  }

  return (
    <li className="relative h-[492px] w-[343px] cursor-pointer rounded-[30px] bg-[white] shadow-[0px_4px_67px_-12px_#00000021]  desktop:h-[501px] desktop:w-[360px]">
      <button
        onClick={handleClickAddTrain}
        className="group cursor-[url(coursor.svg),_pointer] absolute right-[20px] top-[20px]"
      >
        <img src="add-in-Circle.svg" alt="plus" />
        <div className="absolute hidden group-hover:block left-[43px] top-[45px] w-[110px] h-[27px] border-[0.5px] border-black rounded-[5px] bg-white z-10"><p className="text-sm mt-1">Добавить курс</p></div>
      </button>
      <div onClick={handleClick}>
        <MainCardsImage param={train._id} />

        <div className="pb-[15px] pl-[21.5px] pt-[24px] desktop:pb-[15px] desktop:pl-[30px] desktop:pt-[24px]">
          <h3 className="mb-[20px] text-[24px] font-medium desktop:text-[32px] desktop:leading-[32.5px]">{train.nameRU}</h3>
          <ul className="flex flex-wrap gap-[6px]">
            {[
              `${train.workouts.length} ${dayTitle(train.workouts.length)}`,
              "25-50 мин/день",
              "Сложность",
            ].map((tag, index) => (
              <Tags tag={String(tag)} index={index} key={index} />
            ))}
          </ul>
        </div>
      </div>

    </li>
  );
};

export default TrainingItem;
