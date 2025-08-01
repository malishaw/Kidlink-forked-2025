import { Hero } from "@/modules/landing/hero";
import { HotelTypes } from "@/modules/landing/hotel-types";
import { PropertyClasses } from "@/modules/landing/property-classes";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="w-screen min-h-screen">
      <Hero />

      <div className="mt-3 mx-6">
        <Suspense fallback={<div>Loading hotel types...</div>}>
          <HotelTypes />
        </Suspense>
      </div>

      <div className="mt-3 mx-6">
        <Suspense fallback={<div>Loading property classes...</div>}>
          <PropertyClasses />
        </Suspense>
      </div>
    </div>
  );
}
