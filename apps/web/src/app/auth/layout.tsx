export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center flex-col m-auto h-screen">
      {children}
    </div>
  );
}
