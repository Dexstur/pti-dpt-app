import { Logout } from "../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaHome, FaBook, FaTasks, FaProjectDiagram } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import { PiStudentBold } from "react-icons/pi";
import { MdOutlineExitToApp } from "react-icons/md";

interface SidebarProps {
  show: boolean;
  activeNav?:
    | "home"
    | "courses"
    | "invites"
    | "assignments"
    | "projects"
    | "staff"
    | "students";
}

const Wrapper = styled.div`
  width: 180px;
  z-index: 300;
  padding-top: 60px;
  @media (min-width: 768px) {
    width: 240px;
  }
`;

function Sidebar({ show, activeNav = "home" }: SidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );

  const handleLogout = () => {
    Logout(dispatch).then(() => {
      navigate("/");
    });
  };
  return (
    <>
      {show && (
        <Wrapper className="sidebar fixed left-0 flex flex-col gap-2  bg-white px-5 h-screen">
          <nav className="navMenu">
            <ul className="flex flex-col gap-4 md:gap-6 pt-4">
              <li>
                <a
                  href="/dashboard"
                  className={`flex w-full hover:bg-gray-100 p-2 gap-2 items-center ${
                    activeNav === "home" ? "text-pGreen" : ""
                  }`}
                >
                  <FaHome className="text-xl" />
                  <span className="text-l">Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/course"
                  className={`flex w-full hover:bg-gray-100 p-2 gap-2 items-center ${
                    activeNav === "courses" ? "text-pGreen" : ""
                  }`}
                >
                  <FaBook className="text-xl" />
                  <span className="text-l">Courses</span>
                </a>
              </li>
              {authority > 1 && (
                <li>
                  <a
                    href="/invites"
                    className={`flex w-full hover:bg-gray-100 p-2 gap-2 items-center ${
                      activeNav === "invites" ? "text-pGreen" : ""
                    }`}
                  >
                    <RiMailSendLine className="text-xl" />
                    <span className="text-l">Invites</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="/assignments"
                  className={`flex w-full gap-2 hover:bg-gray-100 p-2 items-center ${
                    activeNav === "assignments" ? "text-pGreen" : ""
                  }`}
                >
                  <FaTasks className="text-xl" />
                  <span className="text-l">Assignments</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`flex w-full gap-2 hover:bg-gray-100 p-2 items-center ${
                    activeNav === "projects" ? "text-pGreen" : ""
                  }`}
                >
                  <FaProjectDiagram className="text-xl" />
                  <span className="text-l">Projects</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`flex w-full gap-2 hover:bg-gray-100 p-2 items-center ${
                    activeNav === "staff" ? "text-pGreen" : ""
                  }`}
                >
                  <HiUsers className="text-xl" />
                  <span className="text-l">Staff</span>
                </a>
              </li>
              {authority > 0 && (
                <li>
                  <a
                    href="#"
                    className={`flex w-full gap-2 hover:bg-gray-100 p-2 items-center ${
                      activeNav === "students" ? "text-pGreen" : ""
                    }`}
                  >
                    <PiStudentBold className="text-xl" />
                    <span className="text-l">Students</span>
                  </a>
                </li>
              )}
              <br />
              <hr />
              <br />
              <li>
                <div
                  className="flex w-full gap-2 items-center hover:cursor-pointer text-pRed"
                  onClick={handleLogout}
                >
                  <MdOutlineExitToApp className="text-xl" />
                  <span className="text-l">Logout</span>
                </div>
              </li>
            </ul>
          </nav>
        </Wrapper>
      )}
    </>
  );
}

export default Sidebar;
