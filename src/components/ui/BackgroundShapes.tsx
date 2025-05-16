import Image from "next/image";

export default function BackgroundShapes({ y, x }: { y: string; x: string }) {
  return (
    <div
      className={`pointer-events-none absolute ${y} ${x} w-30 h-30 md:w-45 md:h-45`}
    >
      <Image
        src="/formas-background.svg"
        alt=""
        fill
        className={`absolute -z-0 transform scale-y-[-1] rotate-90 pointer-events-none`}
        aria-hidden="true"
      ></Image>
    </div>
  );
}
