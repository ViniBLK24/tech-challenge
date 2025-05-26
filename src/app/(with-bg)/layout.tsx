export default function WithBgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#EBE8ED] min-h-screen">{children}</div>;
}
