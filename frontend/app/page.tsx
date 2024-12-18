import Tagline from "@/components/logo/Tagline";
import GetStartedButton from "@/components/ui/buttons/GetStartedButton";


export default function Home() {
  return (
    <div className="flex grow justify-center mt-[9rem] ">
      <div className="flex justify-center flex-col gap-7">
        <Tagline />
        <p className="text-gray-400 text-center text-lg  font-semibold">
          The ultimate productivity tool tailored for your needs.
        </p>
        <div className="flex items-center justify-center">
          <GetStartedButton />
        </div>

      </div>
    </div>

  );
}
