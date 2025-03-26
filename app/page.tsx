import BackgroundAnimation from "@/components/Hero/background-animation";
import Homepage from "@/components/Homepage";

export default function Home() {
  return (
    <>
      <main className="flex h-fit w-screen bg-transparent relative z-20  flex-col gap-8 row-start-2 items-center sm:items-start">
        <Homepage />
      </main>
    </>
  );
}
