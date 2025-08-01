import HotelSearchComponent from "@/features/hotels/components/advanced-search";
import Image from "next/image";
import { Navbar } from "./navbar";

export function Hero() {
  return (
    <div className="relative w-full h-[90vh] bg-gradient-to-b from-black/90 to-transparent">
      <Navbar />

      <div className="mt-24 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl text-shadow-2xs md:text-6xl font-bold mb-4">
          Welcome to Bloonsoo.com
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Your one-stop destination for all your travel needs. Explore, book,
          and enjoy your perfect getaway.
        </p>
      </div>

      <div className="absolute z-10 bottom-5 flex items-center justify-center w-full">
        <HotelSearchComponent />
      </div>

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
