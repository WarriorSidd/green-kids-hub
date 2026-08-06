import { ArrowRight, BookOpen, Brain, Gamepad2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl grid-rows-[1fr_auto] px-4 pb-6 pt-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-100">
              <ShieldCheck size={18} />
              SaaS-grade LMS + educational gaming
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">
              Green Kids Hub Learning Portal
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-700">
              A role-based learning platform where children play approved educational games, complete homework, earn achievements, and help teachers see exactly who needs support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-leaf px-5 py-3 font-black text-white shadow-soft">
                Open Portal <ArrowRight size={18} />
              </Link>
              <Link href="/games" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-black text-emerald-900 shadow-sm ring-1 ring-emerald-100">
                Browse Games <Gamepad2 size={18} />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px]">
            <div className="absolute inset-0 rounded-[2rem] bg-white/70 shadow-soft ring-1 ring-white" />
            <div className="absolute left-6 top-6 rounded-lg bg-emerald-500 p-5 text-white shadow-soft">
              <Brain size={38} />
              <p className="mt-3 text-2xl font-black">Brain Builder</p>
              <p className="mt-1 text-sm font-semibold">Memory, focus, logic, and patterns</p>
            </div>
            <div className="absolute right-6 top-28 rounded-lg bg-yellow-300 p-5 text-yellow-950 shadow-soft">
              <BookOpen size={34} />
              <p className="mt-3 text-xl font-black">Homework Hero</p>
              <p className="mt-1 text-sm font-semibold">Due dates and progress tracking</p>
            </div>
            <div className="absolute bottom-7 left-8 right-8 rounded-lg bg-sky-500 p-5 text-white shadow-soft">
              <Gamepad2 size={34} />
              <p className="mt-3 text-xl font-black">225 seeded games</p>
              <p className="mt-1 text-sm font-semibold">Reusable templates for Senior KG to 5th Standard</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {['Students learn through play', 'Teachers track learning gaps', 'Admins control content release'].map((item) => (
            <div key={item} className="rounded-lg bg-white/80 px-4 py-3 text-sm font-black text-emerald-900 shadow-sm ring-1 ring-emerald-100">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
