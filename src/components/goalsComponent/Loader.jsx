export default function Loader() {
    return (
        <div className="loader w-12 aspect-square grid fixed text-[#854f1d] bg-[radial-gradient(farthest-side,currentColor_calc(100%-6px),transparent_calc(100%-5px)_0)] mask-[radial-gradient(farthest-side,transparent_calc(100%-13px),black_calc(100%-12px))] rounded-full animate-pulse">
            <div className="absolute inset-0 bg-[linear-gradient(currentColor_0_0)_center,linear-gradient(currentColor_0_0)_center] bg-[length:100%_10px,10px_100%] bg-no-repeat"></div>
            <div className="absolute inset-0 bg-[linear-gradient(currentColor_0_0)_center,linear-gradient(currentColor_0_0)_center] bg-[length:100%_10px,10px_100%] bg-no-repeat rotate-45"></div>
        </div>
    );
}
