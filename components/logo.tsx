import Image from "next/image";
import Link from "next/link";
import logo from "../public/INSAlogo.png";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={logo}
        alt="INSA Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <span className="font-bold text-lg">
        INSA Personality Testing Platform
      </span>
    </Link>
  );
}
