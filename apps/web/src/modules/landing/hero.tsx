import Image from "next/image";
import { Navbar } from "./navbar";

export function Hero() {
  return (
    <div className="relative w-full h-[90vh] bg-gradient-to-b from-black/90 to-transparent">
      <Navbar />

      <Image
        src={"/assets/hero.jpg"}
        width={1920}
        height={1080}
        alt="Bloonsoo.com"
        className="absolute top-0 left-0 object-cover w-full h-full -z-10"
      />
    </div>
  );
}
