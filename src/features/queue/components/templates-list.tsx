"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Description,
  FieldError,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
} from "@heroui/react";
import { Plus, Trash2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

export function TemplatesList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to load templates");
      const json = await res.json();
      return json.data as Array<{
        id: string;
        name: string;
        content: string;
        category?: string | null;
      }>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      return json;
    },
    onSuccess: () => {
      setName("");
      setContent("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="card-premium">
        <Card.Header className="px-5 pt-5 sm:px-6">
          <Card.Title>New template</Card.Title>
          <Card.Description>
            Save reusable copy for one-click compose.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4 px-5 pb-5 pt-3 sm:px-6">
          <TextField
            fullWidth
            name="templateName"
            value={name}
            onChange={setName}
            variant="secondary"
            className="form-field"
          >
            <Label>Name</Label>
            <Input placeholder="Launch announcement" className="w-full" />
          </TextField>

          <TextField
            fullWidth
            name="templateContent"
            value={content}
            onChange={setContent}
            variant="secondary"
            className="form-field"
          >
            <Label>Content</Label>
            <TextArea
              placeholder="Reusable post content…"
              rows={4}
              maxLength={280}
              className="w-full"
            />
            <Description>{content.length}/280</Description>
          </TextField>

          {error && <FieldError>{error}</FieldError>}

          <Button
            className="btn-glow w-fit"
            isDisabled={!name || !content}
            isPending={createMutation.isPending}
            onPress={() => createMutation.mutate()}
          >
            {({ isPending }) => (
              <>
                {isPending ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <Plus size={14} />
                )}
                Save template
              </>
            )}
          </Button>
        </Card.Content>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {(templates ?? []).map((t) => (
          <Card key={t.id} className="card-premium">
            <Card.Header className="flex flex-row items-start justify-between gap-2 px-4 pt-4 pb-1">
              <Card.Title className="text-base">{t.name}</Card.Title>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  aria-label="Use template"
                  onPress={() =>
                    router.push(
                      `/compose?content=${encodeURIComponent(t.content)}`
                    )
                  }
                >
                  <Copy size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="danger-soft"
                  isIconOnly
                  aria-label="Delete template"
                  onPress={() => deleteMutation.mutate(t.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-muted">{t.content}</p>
            </Card.Content>
          </Card>
        ))}
        {(!templates || templates.length === 0) && (
          <p className="text-sm text-muted md:col-span-2">
            No templates yet. Save frequent posts for one-click reuse.
          </p>
        )}
      </div>
    </div>
  );
}
