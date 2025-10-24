"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleNavigation = () => {
    try {
      router.push("/dashboard");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (              
    <section className="h-full flex items-center">
      <div className="w-full rounded-[50px] bg-[#f9b800] flex flex-col lg:flex-row items-center gap-6 p-8">
        <img 
          className="w-full lg:w-1/2 max-w-[450px] lg:order-2 object-contain" 
          src="https://iili.io/2ysFUen.png" 
          alt="Hero illustration" 
        />
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
            AI Powered Experience Monitoring
          </h1>
          <span className="text-lg lg:text-xl font-semibold block mb-2">
            Discover hidden insights with AI
          </span>
          <p className="text-lg lg:text-xl mb-6">
            Get real-time insights on your brand's performance and user experience.
          </p>
          <Button 
            className="w-full max-w-[350px] text-lg font-bold rounded-full bg-[#262626] text-white px-6 py-4"
            onClick={handleNavigation}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}