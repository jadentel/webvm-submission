"use client";

import { questions } from '../../../data/questions';
import Workspace from '../../components/workspace';
import Link from 'next/link';

export default function QuestionPage({ params }) {
  const { id } = params;
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        <p>Question not found</p>
        <Link href="/" className="text-blue-400 hover:underline">
          Return to Terminal
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <header className="p-4 border-b border-green-600 flex items-center">
        <Link href="/">
          <button className="bg-green-700 text-black rounded-full p-2 hover:bg-green-600 transition-all duration-200 mr-4">
            x
          </button>
        </Link>
        <h1 className="text-xl font-bold">
          user@linux-terminal:~/challenge-{question.id}$
        </h1>
      </header>

      <section className="p-8">
        <h2 className="text-3xl mb-4">{question.title}</h2>

      </section>

      <Workspace key={question.id} question={question} />
    </div>
  );
}
