import Link from "next/link";
import clsx from "clsx";

export default function TabletMenu() {
  return (
    <div className="hidden px-4 md:block lg:hidden">
      <ul className="grid grid-cols-4 gap-6 pt-0 relative">
        <MenuLink isCurrent={true}>Início</MenuLink>
        <MenuLink isCurrent={false}>Transferências</MenuLink>
        <MenuLink isCurrent={false}>Investimentos</MenuLink>
        <MenuLink isCurrent={false}>Outros serviços</MenuLink>
      </ul>
    </div>
  );
}

function MenuLink({
  children,
  isCurrent,
}: {
  children: React.ReactNode;
  isCurrent: boolean;
}) {
  return (
    <li
      className={clsx(
        "relative pb-5 text-center text-lg inline-block",
        isCurrent &&
          "font-bold before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1.5px] before:bg-black"
      )}
    >
      <Link href="/dashboard">{children}</Link>
    </li>
  );
}
