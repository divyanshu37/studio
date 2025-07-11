
import HomeRedirect from '@/components/home-redirect';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeRedirect />
    </Suspense>
  );
}
