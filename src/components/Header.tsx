import { FaBars } from "react-icons/fa";
import { styled } from "styled-components";

interface HeaderProps {
  toggleMenu: () => void;
}

const Wrapper = styled.header`
  height: 60px;
  z-index: 600;
`;

function Header({ toggleMenu }: HeaderProps) {
  return (
    <Wrapper className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-pGreen text-white">
      <div className="brand flex gap-2">
        <FaBars
          className="block md:hidden border-2 border-white rounded-md p-2"
          size={32}
          onClick={() => toggleMenu()}
        />
        <h1 className="text-xl font-bold">PTI</h1>
      </div>
      <a href="#" className="text-sm">
        Profile
      </a>
    </Wrapper>
  );
}

export default Header;
