'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const newUuid = uuidv4();
    router.replace(`/${newUuid}`);
  }, [router]);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center">
      <div className="relative w-24 h-24">
        <svg
          className="animate-spin h-full w-full text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 50,10 A 40,40 0 1 1 10,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-4">Preparing your application...</p>
    </div>
  );
}
