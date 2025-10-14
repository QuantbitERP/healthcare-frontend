import Image from "next/image";

interface LoaderProps {
  loading?: boolean;
}

export default function Loader({ loading = false }: LoaderProps) {
  if (!loading) {
    return null;
  }

  return (
    <div className="bg-white/60 overflow-hidden flex flex-col items-center justify-center absolute inset-0">
      <Image
        src="/loaderAnimation.gif"
        alt="Loading"
        width={106}
        height={106}
        className="mb-4 object-cover"
        priority
      />
    </div>
  );
}
