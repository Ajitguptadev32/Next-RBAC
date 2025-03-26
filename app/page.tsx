import BackgroundAnimation from "@/components/Hero/background-animation";
import LoginPage from "@/components/LoginPage";

export default function Home() {
  return (
    <>
      {/* <main className="flex h-fit w-screen bg-transparent relative z-20  flex-col gap-8 row-start-2 items-center sm:items-start"> */}
      <main className="w-screen bg-transparent relative z-20">
        <LoginPage />
      </main>
    </>
  );
}
