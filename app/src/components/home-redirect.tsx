
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function HomeRedirect() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const newUuid = uuidv4();
    const url = `/${newUuid}`;
    setRedirectUrl(url);
    router.replace(url);
  }, [router]);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center text-center p-4">
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
      <p className="mt-4">Redirecting you to a new session...</p>
      {redirectUrl && (
        <p className="mt-2 text-sm text-muted-foreground">
          If you are not redirected,{' '}
          <Link href={redirectUrl} className="underline text-primary">
            click here to continue
          </Link>
          .
        </p>
      )}
    </div>
  );
}
