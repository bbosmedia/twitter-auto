"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "../schemas";
import { AccountSelector } from "@/components/shared/account-selector";
import { CharCounter } from "@/components/shared/char-counter";
import { MultiAccountPostPreview } from "@/components/shared/post-preview";
import { SchedulePicker } from "./schedule-picker";
import { useAccounts } from "@/hooks/use-accounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  FieldError,
  Label,
  Separator,
  Spinner,
  TextArea,
  TextField,
  ToggleButton,
} from "@heroui/react";
import {
  CalendarClock,
  FileText,
  ImageIcon,
  MapPin,
  Smile,
  ListOrdered,
  Send,
} from "lucide-react";
import { cn } from "@/utils/cn";

export function PostComposer({
  initialContent = "",
}: {
  initialContent?: string;
}) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [previewAccountId, setPreviewAccountId] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: accounts } = useAccounts();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: initialContent,
      accountIds: [],
    },
  });

  const content = watch("content") || "";

  const selectedAccountObjects = useMemo(() => {
    const list = accounts || [];
    return list.filter((a: { id: string }) => selectedAccounts.includes(a.id));
  }, [accounts, selectedAccounts]);

  useEffect(() => {
    if (
      selectedAccounts.length > 0 &&
      (!previewAccountId || !selectedAccounts.includes(previewAccountId))
    ) {
      setPreviewAccountId(selectedAccounts[0]);
    }
    if (selectedAccounts.length === 0) {
      setPreviewAccountId(null);
    }
  }, [selectedAccounts, previewAccountId]);

  const createPost = useMutation({
    mutationFn: async (
      payload: PostInput & { mode: "draft" | "schedule" | "now" }
    ) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to create post");
      return json;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      reset({ content: "", accountIds: [] });
      setSelectedAccounts([]);
      setScheduledAt(null);
      setScheduleMode(false);
      setError(null);
      if (vars.mode === "draft") {
        setSuccess("Draft saved");
        setTimeout(() => router.push("/drafts"), 600);
      } else if (vars.mode === "schedule") {
        setSuccess("Post scheduled");
        setTimeout(() => router.push("/queue"), 600);
      } else {
        setSuccess("Publish queued");
        setTimeout(() => router.push("/queue"), 600);
      }
    },
    onError: (err: Error) => {
      setSuccess(null);
      setError(err.message);
    },
  });

  const submit = (mode: "draft" | "schedule" | "now") => {
    setValue("accountIds", selectedAccounts, { shouldValidate: true });
    handleSubmit((data) => {
      if (mode === "schedule" && !scheduledAt) {
        setError("Pick a schedule time");
        return;
      }
      createPost.mutate({
        ...data,
        accountIds: selectedAccounts,
        scheduledAt: mode === "schedule" ? scheduledAt : null,
        mode,
      });
    })();
  };

  const remaining = 280 - content.length;
  const overLimit = remaining < 0;

  return (
    <div className="grid w-full gap-6 lg:grid-cols-2 lg:items-start">
      {/* ── Composer (X-style compose panel) ─────────────────────────── */}
      <Card className="card-premium w-full overflow-hidden">
        <Card.Header className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Card.Title className="text-lg font-bold tracking-tight">
                Compose
              </Card.Title>
              <Card.Description>
                Draft looks like the real post on X
              </Card.Description>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-slate-900"
              aria-hidden
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </Card.Header>

        <Card.Content className="flex flex-col gap-0 !p-0">
          {/* X-like compose row */}
          <div className="flex gap-3 px-5 pt-5 sm:px-6">
            <div className="shrink-0">
              <Avatar>
                {selectedAccountObjects[0]?.avatar ? (
                  <Avatar.Image
                    src={selectedAccountObjects[0].avatar}
                    alt=""
                  />
                ) : null}
                <Avatar.Fallback>
                  {(
                    selectedAccountObjects[0]?.username?.[0] || "P"
                  ).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    isInvalid={!!errors.content || overLimit}
                    className="compose-textarea x-compose-field"
                    variant="secondary"
                  >
                    <Label className="sr-only">Post</Label>
                    <TextArea
                      placeholder="What's happening?"
                      rows={5}
                      maxLength={400}
                      className="!m-0 !resize-none !border-0 !bg-transparent !p-0 !text-[20px] !leading-6 !shadow-none"
                    />
                    {errors.content && (
                      <FieldError>{errors.content.message}</FieldError>
                    )}
                  </TextField>
                )}
              />

              {/* X toolbar strip */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex items-center gap-0.5 text-accent">
                  {[ImageIcon, ListOrdered, Smile, CalendarClock, MapPin].map(
                    (Icon, i) => (
                      <Button
                        key={i}
                        isIconOnly
                        size="sm"
                        variant={i === 3 && scheduleMode ? "secondary" : "ghost"}
                        className="text-accent"
                        aria-label={i === 3 ? "Schedule" : "Coming soon"}
                        onPress={() => {
                          if (i === 3) setScheduleMode((v) => !v);
                        }}
                      >
                        <Icon size={18} />
                      </Button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "relative flex h-7 w-7 items-center justify-center",
                      overLimit && "text-rose-500"
                    )}
                    title={`${content.length} / 280`}
                  >
                    <svg className="h-7 w-7 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke={
                          overLimit
                            ? "#f43f5e"
                            : remaining <= 20
                              ? "#f59e0b"
                              : "#1d9bf0"
                        }
                        strokeWidth="2.5"
                        strokeDasharray={`${Math.min(
                          100,
                          (content.length / 280) * 97.4
                        )} 97.4`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {remaining <= 20 && (
                      <span
                        className={cn(
                          "absolute text-[10px] font-semibold tabular-nums",
                          overLimit ? "text-rose-500" : "text-amber-600"
                        )}
                      >
                        {remaining}
                      </span>
                    )}
                  </div>
                  <CharCounter current={content.length} max={280} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-5 sm:px-6">
            <AccountSelector
              accounts={accounts || []}
              selected={selectedAccounts}
              onChange={(ids) => {
                setSelectedAccounts(ids);
                setValue("accountIds", ids, { shouldValidate: true });
              }}
              isInvalid={!!errors.accountIds}
              errorMessage={errors.accountIds?.message}
            />

            <div className="flex flex-wrap gap-2">
              <ToggleButton
                isSelected={scheduleMode}
                onChange={setScheduleMode}
                size="sm"
              >
                <CalendarClock size={15} />
                Schedule
              </ToggleButton>
            </div>

            <SchedulePicker
              enabled={scheduleMode}
              value={scheduledAt}
              onChange={setScheduledAt}
            />

            {error && (
              <Alert status="danger">
                <Alert.Content>
                  <Alert.Title>Could not save</Alert.Title>
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Content>
              </Alert>
            )}
            {success && (
              <Alert status="success">
                <Alert.Content>
                  <Alert.Title>{success}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}

            <Separator />

            <div className="flex flex-wrap items-center justify-end gap-2 pt-0.5">
              <Button
                variant="secondary"
                isDisabled={createPost.isPending}
                onPress={() => submit("draft")}
              >
                <FileText size={15} />
                Save draft
              </Button>
              {scheduleMode ? (
                <Button
                  className="btn-glow !rounded-full px-5"
                  isPending={createPost.isPending}
                  isDisabled={overLimit}
                  onPress={() => submit("schedule")}
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? (
                        <Spinner size="sm" color="current" />
                      ) : (
                        <CalendarClock size={15} />
                      )}
                      Schedule
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="btn-glow !rounded-full px-5"
                  isPending={createPost.isPending}
                  isDisabled={overLimit}
                  onPress={() => submit("now")}
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? (
                        <Spinner size="sm" color="current" />
                      ) : (
                        <Send size={15} />
                      )}
                      Post
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* ── Live X preview ───────────────────────────────────────────── */}
      <div className="flex w-full flex-col gap-3 lg:sticky lg:top-20">
        <div className="flex items-end justify-between gap-2 px-0.5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Timeline preview
            </h2>
            <p className="text-xs text-slate-500">
              How this post will appear on X
            </p>
          </div>
          {scheduleMode && scheduledAt ? (
            <Chip size="sm" color="accent" variant="soft">
              Scheduled
            </Chip>
          ) : (
            <Chip size="sm" variant="soft">
              Post now
            </Chip>
          )}
        </div>

        <MultiAccountPostPreview
          content={content}
          accounts={selectedAccountObjects}
          scheduledAt={scheduleMode ? scheduledAt : null}
          activeId={previewAccountId}
          onSelectAccount={setPreviewAccountId}
        />

        <p className="px-0.5 text-[11px] leading-relaxed text-slate-400">
          Preview highlights @mentions, #hashtags, and links like X. Engagement
          counts stay empty until the post is live.
        </p>
      </div>
    </div>
  );
}
