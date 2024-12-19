import TrainingItem from "./TrainingItem";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

const TrainingList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, "/courses");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data);
    });
  }, [database]);
  return (
    <ul className="mt-[34px]  desktop:w-[1160px] desktop:mt-[50px] flex min-h-[1000px] flex-wrap justify-center gap-[20px] sm:justify-start sm:gap-[30px] lg:gap-[40px]">
      {items.map((item, index) => (
        <TrainingItem train={item} key={index} />
      ))}
    </ul>
  );
};

export default TrainingList;