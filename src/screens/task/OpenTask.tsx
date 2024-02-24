import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  count: number;
}

function OpenTask({ count }: Props) {
  return (
    <div className="w-full md:w-1/4 p-3 rounded-lg bg-white">
      <div className="flex gap-4 items-center">
        <FaTasks className="text-xl" />
        <h2 className="text-xl">Ongoing Assignments</h2>
      </div>
      <p className="px-5 py-3" style={{ fontSize: "24px", fontWeight: "bold" }}>
        {count}
      </p>
      <br />
      <div className="text-center py-3">
        <Link
          to="/assignments/ongoing"
          className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default OpenTask;
