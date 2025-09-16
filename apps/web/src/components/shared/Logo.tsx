import Image from "next/image";
import LogoImage from "/public/assets/images/logo.png";

interface LogoProps {
  width?: string;
  height?: string;
}

const Logo = ({ width, height }: LogoProps) => {
  return (
    <div className="z-50" style={{ width, height }}>
      <Image
        src={LogoImage}
        alt="Kong marketplace"
        className="h-full w-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
