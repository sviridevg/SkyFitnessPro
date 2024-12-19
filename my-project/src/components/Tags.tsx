import React from "react";

const Tags: React.FC<{ index: number; tag: string }> = ({ index, tag }) => {
  return (
    <li className=" flex items-center p-[10px] bg-[#F7F7F7] text-[16px] leading-[17.6px] rounded-[50px] gap-[7.5px]">
      <img
        src={
          index === 0 ? "calendar.svg" : index === 1 ? "time.svg" : "level.svg"
        }
        alt=""
      />
      {tag}
    </li>
  );
};

export default Tags;
