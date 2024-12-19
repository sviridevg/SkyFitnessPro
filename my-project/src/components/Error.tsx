type ErrorType = {
  error?: string;
};

const Error = ({ error }: ErrorType) => {
  return (
    <h2 className="text-aqua mix-blend-difference; relative align-middle text-[14px]">
      Произошла ошибка{error}
    </h2>
  );
};

export default Error;
