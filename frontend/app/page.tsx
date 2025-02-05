import Tagline from "@/components/logo/Tagline";
import Navbar from "@/components/Navbar/Navbar";
import GetStartedButton from "@/components/ui/buttons/GetStartedButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskDeck",
  description: "Organize. Prioritize. Execute.",
  icons: {
    icon: "/Logo.svg",
    apple: "/favicon.png",
  },
};


export default function Home() {
  return (

    <div className="flex flex-col  items-center justify-center">
      <Navbar />
      <div className="flex grow justify-center mt-[9rem] ">
        <div className="flex justify-center flex-col gap-7">
          <Tagline />
          <p className="text-gray-400 text-center text-lg  font-semibold">
            Empowering teams to build, share, and grow together.
          </p>
          <div className="flex items-center justify-center">
            <GetStartedButton />
          </div>

        </div>
      </div>
    </div>


  );
}
