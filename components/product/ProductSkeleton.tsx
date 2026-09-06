import React from 'react';

export default function ProductSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`product-card group flex flex-col border border-gray-100 rounded-xl overflow-hidden animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative block bg-gray-200 aspect-square rounded-t-xl" />

      {/* Info Skeleton */}
      <div className="flex flex-col flex-1 p-3 space-y-2">
        <div className="h-2 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        
        <div className="mt-auto space-y-2 pt-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
