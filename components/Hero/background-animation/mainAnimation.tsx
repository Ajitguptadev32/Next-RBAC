'use client'
import { HeroBackground } from "./demo-bakgroundanim";

export const HeroSection = () => {
    return (
      <section className="relative h-screen w-full bg-white overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
  
            Transform Your Space
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8">
            Premium interior design solutions tailored to your unique style
          </p>
          <button className="px-8 py-3 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors">
            Explore Designs
          </button>
        </div>
      </section>
    );
  };