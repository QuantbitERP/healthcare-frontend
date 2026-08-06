// app/PR/page.tsx
import { Suspense } from 'react';
import ClientPR from './ClientPR'; // We'll create this next

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return (
    <div className="bg-gray-50 min-h-screen px-3">
      <Suspense fallback={<div className="flex justify-center items-center h-64">Loading requisition...</div>}>
        {/* Pass the searchParams prop to the client child */}
        <ClientPR searchParams={searchParams} />
      </Suspense>
    </div>
  );
}