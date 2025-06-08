import { HOME_PAGE } from "@/features/StudentOverall/constants/homePageStrings";
import HERO_BOY from "/assets/hero-boy.svg";
import HERO_GIRL from "/assets/hero-girl.svg";
import BLOB_RED from "/assets/blob-red.svg";
import BLOB_PURPLE from "/assets/blob-purple.svg";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden md:py-32">
      <div className="container px-4 md:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Text Column */}
          <div className="z-10 flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{HOME_PAGE.HERO.TITLE}</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{HOME_PAGE.HERO.DESCRIPTION}</p>
            </div>
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
              size="lg"
              className="gap-2 text-white w-fit"
            >
              {HOME_PAGE.HERO.REGISTER}
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Visual Column */}
          <div className="relative w-full aspect-[4/3] lg:aspect-[5/3] desktop-only">
            {/* Blobs */}
            <img src={BLOB_RED} alt="Background-red" className="absolute w-[70%] max-w-[500px] -top-[40%] left-0 z-0" />
            <img
              src={BLOB_PURPLE}
              alt="Background-purple"
              className="absolute w-[80%] max-w-[500px] top-[0%] right-0 z-0 opacity-80"
            />

            {/* Characters */}
            <img
              src={HERO_BOY}
              alt="Developer with laptop"
              className="absolute w-[50%] lg:w-[60%] max-w-[300px] 2xl:max-w-[400px] -left-[5%] bottom-0 z-10"
            />
            <img
              src={HERO_GIRL}
              alt="Person with phone"
              className="absolute w-[35%] lg:w-[45%] max-w-[200px] 2xl:max-w-[300px] right-[5%] bottom-0 z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
