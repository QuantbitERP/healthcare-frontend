import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-900/100 dark:bg-zinc-200/90", className)}
      {...props}
    />
  );
};

export { Skeleton };

