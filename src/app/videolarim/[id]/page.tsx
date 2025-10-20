// src/app/videolarim/[id]/page.tsx
import VideoEditWrapper from "@/features/videolarim/containers/VideoEditWrapper";

export default function Page({ params }: { params: { id: string } }) {
  return <VideoEditWrapper id={params.id} />;
}
