"use client";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex cursor-pointer items-center">
      <div className="w-6 md:w-12">
        <Image
          width={32}
          height={32}
          alt="logo"
          src={"/Logo.svg"}
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <span className="ml-2 text-2xl font-extralight text-black md:text-4xl">
        TechStore
      </span>
    </div>
  );
};

export default Logo;
