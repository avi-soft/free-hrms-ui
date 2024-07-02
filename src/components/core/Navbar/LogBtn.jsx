import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function LogBtn({ link, text }) {
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;

  return (
    <Link to={link}>
      <button
        className={`border px-[12px] py-[8px] text-white rounded-md transition-all duration-300 ${
          darkMode
            ? "border-gray-300 bg-gray-700 hover:bg-gray-600"
            : "border-gray-900 bg-slate-900 hover:bg-slate-800"
        }`}
      >
        {text}
      </button>
    </Link>
  );
}

export default LogBtn;
