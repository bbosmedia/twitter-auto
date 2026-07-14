import { TemplatesList } from "@/features/queue/components/templates-list";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted">
          Save reusable copy and drop it into Compose in one click.
        </p>
      </div>
      <TemplatesList />
    </div>
  );
}
