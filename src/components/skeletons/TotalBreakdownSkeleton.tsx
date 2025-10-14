import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TotalBreakdownSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col w-[256px] h-fit rounded-lg bg-white flex-shrink-0 gap-4 border border-[#D9D9E0] p-4 shadow-sm'>
      <div className='flex flex-col gap-5'>
        <Skeleton className="w-[109px] h-4 rounded-full"/> 
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row justify-between'>
            <Skeleton className="w-[91px] h-3 rounded-full"/> 
            <Skeleton className="w-4 h-4 rounded-full"/> 
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 items-center'>
              <Skeleton className="w-[51px] h-3 rounded-full"/> 
              <Skeleton className="w-4 h-4 rounded-full"/> 
            </div>
            <Skeleton className="w-4 h-4 rounded-full"/> 
          </div>
          <div className='flex flex-row justify-between'>
            <Skeleton className="w-[124px] h-3 rounded-full"/> 
            <Skeleton className="w-4 h-4 rounded-full"/> 
          </div>
          <div className='flex flex-row justify-between'>
            <Skeleton className="w-[51px] h-3 rounded-full"/> 
            <Skeleton className="w-4 h-4 rounded-full"/> 
          </div>
        </div>
      </div>   
      <div className='flex flex-col gap-4'>
        <Skeleton className="w-full h-[1px] rounded-lg"/> 
        <div className='flex flex-row justify-between'>
          <Skeleton className="w-[121px] h-4 rounded-lg"/> 
          <Skeleton className="w-4 h-4 rounded-full"/> 
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <Skeleton className="w-[121px] h-3 rounded-lg"/> 
          <Skeleton className="w-4 h-4 rounded-full"/> 
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <Skeleton className="w-full h-10 rounded-lg"/> 
        <Skeleton className="w-full h-10 rounded-lg"/> 
      </div>
    </div>
  );
}

export default TotalBreakdownSkeleton;
