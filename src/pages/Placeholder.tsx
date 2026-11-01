import Footer from "../components/Footer";

export default function Placeholder({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="flex min-h-screen flex-col pt-28">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <img src="/logoicon.png" alt="" className="mb-6 h-16 w-16 opacity-80" />
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-md text-white/50">{copy}</p>
      </div>
      <Footer />
    </div>
  );
}
