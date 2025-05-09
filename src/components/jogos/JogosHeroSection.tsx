
import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Brain, Book, Award } from 'lucide-react';

export const JogosHeroSection = () => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 z-10"></div>
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-20 mix-blend-overlay"></div>
      
      <motion.div 
        className="relative z-20 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Jogos Jurídicos</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-6">
          Aprenda e teste seus conhecimentos jurídicos de forma divertida e interativa através de quizzes, simulações e outros jogos especialmente desenvolvidos para estudantes e profissionais do Direito.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: <Book className="h-6 w-6" />, text: "Aprenda jogando" },
            { icon: <Brain className="h-6 w-6" />, text: "Desenvolva habilidades" },
            { icon: <Gavel className="h-6 w-6" />, text: "Pratique casos reais" },
            { icon: <Award className="h-6 w-6" />, text: "Ganhe conquistas" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {item.icon}
              <span className="mt-2 text-sm md:text-base">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
