"use client";
import Image from "next/image";
import { siteConfig } from "@/config";

const Logo = () => {
  return (
    <div className="flex cursor-pointer items-center">
      <div className="w-6 md:w-12">
        <Image
          width={32}
          height={32}
          alt="logo"
          src={"/Logo.svg"}
          className="w-auto h-auto"
        />
      </div>
      <span className="ml-2 text-2xl font-extralight text-black md:text-4xl">
        {siteConfig.name}
      </span>
    </div>
  );
};

export default Logo;
