export default function FixedPop({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4 w-full min-h-full z-20 fixed top-0 left-1/2 -translate-x-1/2 bg-amber-100/20 backdrop-blur-2xl">
      {children}
    </div>
  );
}
