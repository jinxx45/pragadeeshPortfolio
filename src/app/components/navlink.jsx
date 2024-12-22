"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ link, onlinkClick }) => {
  const pathName = usePathname();

  return (
    <Link
      onClick={onlinkClick}
      className={`rounded p-1 ${
        pathName === link.url && "bg-black text-white"
      }`}
      href={link.url}
    >
      {link.title}
    </Link>
  );
};

export default NavLink;
