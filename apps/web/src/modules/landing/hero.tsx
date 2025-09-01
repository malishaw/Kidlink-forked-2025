import HotelSearchComponent from "@/features/hotels/components/advanced-search";
<<<<<<< HEAD
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { BookOpen, Heart, Users } from "lucide-react";
import Image from "next/image";
=======
>>>>>>> origin/feature/nursery
import { Navbar } from "./navbar";

export function Hero() {
  return (
<<<<<<< HEAD
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] bg-gradient-to-b from-black/90 to-transparent">
        <Navbar />

        <div className="mt-24 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl text-shadow-2xs md:text-6xl font-bold mb-4">
            Welcome to KidLink.com
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Nurturing Little Minds for a Bright Future.
          </p>
        </div>

        <div className="absolute z-10 bottom-5 flex items-center justify-center w-full">
          <HotelSearchComponent />
        </div>

        <Image
          src={"/assets/back3.jpg"}
          width={1920}
          height={1080}
          alt="KidLink.com"
          className="absolute top-0 left-0 object-cover w-full h-full -z-10"
        />
=======
    <div className="relative w-full h-[90vh] bg-gradient-to-b from-black/20 to-transparent">
      <Navbar />
      <div className="pt-24 flex flex-col items-center justify-center text-white text-center ">
        {/* <h1 className="text-4xl text-shadow-2xs md:text-6xl font-bold mt-6 mb-4">
          Welcome to Ejobs.com
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Your one-stop destination for all your travel needs. Explore, book,
          and enjoy your perfect getaway.
        </p> */}
>>>>>>> origin/feature/nursery
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-sans">
              Why Families Choose Little Waves
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We create a safe, stimulating environment where every child can
              thrive and reach their full potential.
            </p>
          </div>

<<<<<<< HEAD
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">
                  Expert Educators
                </CardTitle>
                <CardDescription>
                  Qualified teachers with early childhood education degrees and
                  ongoing professional development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">
                  Play-Based Learning
                </CardTitle>
                <CardDescription>
                  Age-appropriate curriculum that makes learning fun through
                  exploration, creativity, and discovery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">
                  Nurturing Care
                </CardTitle>
                <CardDescription>
                  Small class sizes ensure personalized attention and emotional
                  support for every child's unique needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-sans">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored programs for different age groups, designed to support
              developmental milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Tiny Tots (6-18 months)
                </CardTitle>
                <CardDescription>
                  Gentle care focusing on sensory exploration, motor skills, and
                  secure attachment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sensory play activities</li>
                  <li>• Music and movement</li>
                  <li>• Individual care routines</li>
                  <li>• Parent communication app</li>
                </ul>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Little Explorers (18 months - 3 years)
                </CardTitle>
                <CardDescription>
                  Encouraging independence, language development, and social
                  skills through play.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Language development</li>
                  <li>• Potty training support</li>
                  <li>• Creative arts & crafts</li>
                  <li>• Outdoor playground time</li>
                </ul>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Pre-School Ready (3-5 years)
                </CardTitle>
                <CardDescription>
                  School readiness program with early literacy, numeracy, and
                  social preparation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Pre-literacy & numeracy</li>
                  <li>• Science experiments</li>
                  <li>• Social skills development</li>
                  <li>• School transition support</li>
                </ul>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
=======
      {/* Background video */}
      <video
        className="absolute top-0 left-0 object-cover w-full h-full -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/vid3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
>>>>>>> origin/feature/nursery
  );
}
