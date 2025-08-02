export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF]">
      {children}
    </div>
  );
} 