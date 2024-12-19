"use client";

type MainCardsImageType = {
  param: string | undefined;
};

export const MainCardsImage = ({ param }: MainCardsImageType) => {
  let src;

  switch (param) {
    case "ab1c3f":
      src = (
        <div className="desktop:h-[325px] overflow-hidden rounded-[30px]">
          <img className="w-full object-cover" src={"yoga.png"} alt={"yoga"} />
        </div>
      );
      break;

    case "kfpq8e":
      src = (
        <div className="desktop:h-[325px] overflow-hidden rounded-[30px]">
          <img className="w-full object-cover" src={"stretching.png"} alt={"stretching"} />
        </div>
      );
      break;

    case "ypox9r":
        src=(
      <div className="desktop:h-[325px] overflow-hidden rounded-[30px]">
      <img className="w-full object-cover" src={"danceFitness.png"} alt={"danceFitness"} />
    </div>
        )
      break;

    case "6i67sm":
        src=(
      <div className="desktop:h-[325px] overflow-hidden rounded-[30px]">
      <img className="w-full object-cover" src={"stepAirobic.png"} alt={"stepAirobic"} />
    </div>
        )
      break;

    case "q02a6i":
      src = "bodyFlex.png";
      src=(
        <div className="desktop:h-[325px] overflow-hidden rounded-[30px]">
        <img className="w-full object-cover" src={"bodyFlex.png"} alt={"bodyFlex"} />
      </div>
      )
      break;

    default:
      break;
  }
  return src;
};
