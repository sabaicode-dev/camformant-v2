export default function EditorLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute w-full h-full bg-primaryCam">
      <div>{children}</div>
    </div>
  );
}
