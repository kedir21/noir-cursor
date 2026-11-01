export default function TrailerModal({
  youtubeId,
  onClose,
}: {
  youtubeId: string | null;
  onClose: () => void;
}) {
  if (!youtubeId) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-6" onClick={onClose}>
      <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Trailer"
        />
      </div>
    </div>
  );
}
