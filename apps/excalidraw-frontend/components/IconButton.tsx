import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: Boolean;
}) {
  return (
    <div className="">
      <button
        className={`px-3 py-3 text-white  hover:bg-gray-700/40   rounded-2xl cursor-pointer ${activated ? "bg-purple-300/30 hover:bg-purple-300/30" : ""}`}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
}
