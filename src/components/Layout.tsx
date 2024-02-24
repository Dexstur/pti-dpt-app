import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState, ReactNode, useEffect } from "react";
import { styled } from "styled-components";

interface LayoutProps {
  children: ReactNode;
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
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Content = styled.div`
  padding-top: 60px;
  width: 100%;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding-left: 240px;
  }
`;

function Layout({ children, activeNav }: LayoutProps) {
  const [show, setShow] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setShow(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function toggleSidebar() {
    setShow(!show);
  }

  function closeSidebar() {
    if (window.innerWidth < 768) setShow(false);
  }
  return (
    <Wrapper>
      <Header toggleMenu={toggleSidebar} />
      <Sidebar show={show} activeNav={activeNav} />
      <Content className="bg-gray-100" onClick={closeSidebar}>
        {children}
      </Content>
    </Wrapper>
  );
}

export default Layout;
