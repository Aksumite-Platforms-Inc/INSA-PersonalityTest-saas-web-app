// components/SearchParamsWrapper.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, ReactNode } from 'react';

interface SearchParamsWrapperProps {
  children: (searchParams: URLSearchParams) => ReactNode;
}

function SearchParamsContent({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  );
}