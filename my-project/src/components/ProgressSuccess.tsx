function ProgressSuccess() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-[426px] bg-white p-6 rounded-[30px] shadow-lg z-10 flex flex-col items-center">
          <p className="font-normal text-4xl text-center">Ваш прогресс засчитан!</p>
        <img src="../../../success.svg" alt="Success" className="mt-[34px] mb-4" />
      </div>
    </div>
  );
}

export default ProgressSuccess