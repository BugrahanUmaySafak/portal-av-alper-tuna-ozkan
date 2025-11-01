import VideoEditWrapper from "@/features/videolarim/containers/VideoEditWrapper";

// Next 15: params Promise
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VideoEditWrapper id={id} />;
}
