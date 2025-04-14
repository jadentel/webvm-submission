// src/app/page.tsx
'use client'
import { questions } from '../data/questions';
import Link from 'next/link';
import React from 'react';


function Typewriter({ text, speed = 50, className = "" }) {
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      <header className="p-4 border-b border-green-600">
        <p className="text-sm">Welcome to the Linux Terminal powered by Cheerpx</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="max-w-3xl w-full p-10 text-center">
          <h1 className="text-4xl mb-6">
            <span>user@linux-terminal:~$ </span>
            <Typewriter text="echo 'Learning Linux with Cheerpx, Leaning tech hackathon 2025!'" speed={50} />
            <span className="animate-pulse">|</span>
          </h1>
          <p className="mb-8">
            Explore interactive Linux challenges. Type commands, run scripts, and learn as if you’re in your own terminal.
          </p>
          <div className="space-y-4">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/questions/${question.id}`}
                className="block p-4 border border-green-600 rounded hover:bg-green-600 hover:text-black transition duration-300"
              >
                <span className="mr-2">➜</span>
                {question.title}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-4 border-t border-green-600">

      </footer>
    </div>
  );
}
