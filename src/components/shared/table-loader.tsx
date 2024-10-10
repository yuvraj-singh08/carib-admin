const TableLoader = () => {
  return (
    <div className="w-full min-h-[60vh] py-10 flex items-center justify-center">
      <div className="w-20 h-auto relative">
        <img
          src="/icons/loader.svg"
          alt="loader icon"
          className="w-full h-full object-contain opacity-65 animate-spin"
          style={{ transformOrigin: "center center" }}
        />
      </div>
    </div>
  );
};

export default TableLoader;
