export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e17] text-white font-sans">
        {children}
      </body>
    </html>
  );
}