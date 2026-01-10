import ProtectedProviders from "./providers";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedProviders>{children}</ProtectedProviders>;
}
