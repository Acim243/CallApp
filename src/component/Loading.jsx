import ReactLoading from "react-loading";
const Loading = () => {
  return (
    <div className="fixed inset-0 w-screen z-[100] h-screen bg-black bg-opacity-30">
      <div className="flex w-screen h-screen">
        <div className="mx-auto my-auto">
          <ReactLoading
            type={"cylon"}
            color={"#fffff"}
            height={"40px"}
            width={"40px"}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
