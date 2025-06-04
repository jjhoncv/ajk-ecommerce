"use client";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config";

const Logo = () => {
  return (
    <Link href="/" className="flex cursor-pointer items-center">
      <Image
        width={32}
        height={32}
        alt="logo"
        src={"/Logo.svg"}
        className="w-auto h-auto mr-2"
      />
      <span className="text-2xl font-extralight text-black md:text-4xl">
        {siteConfig.name}
      </span>
    </Link>
  );
};

export default Logo;
