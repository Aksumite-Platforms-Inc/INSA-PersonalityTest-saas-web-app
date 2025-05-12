import Image from "next/image";
import Link from "next/link";
import logo from "../public/INSAlogo.png";

export function LargeLogo() {
  return (
    <Link href="/" className="flex flex-col  items-center gap-2">
      <Image
        src={logo}
        alt="INSA Logo"
        width={80}
        // height={90}
        className="object-contain"
      />
      {/* <span className="font-bold text-lg">
        INSA Personality Testing Platform
      </span> */}
    </Link>
  );
}
