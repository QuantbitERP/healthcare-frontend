import Image from 'next/image';

interface LoadingProps {
    loading: boolean;
}

const Loader = ({ loading }: LoadingProps) => {
    if (!loading) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 z-50">
            <div className="flex flex-col items-center justify-center">
                <Image
                    src="/loaderAnimation.gif"
                    alt="Loading"
                    width={106}
                    height={106}
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
};

export default Loader;
