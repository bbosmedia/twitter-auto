import { PostComposer } from "@/features/posts/components/post-composer";

export default function ComposePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Compose</h1>
      <PostComposer />
    </div>
  );
}
