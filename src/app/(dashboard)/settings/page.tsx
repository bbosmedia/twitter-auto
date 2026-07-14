"use client";

import { useSession } from "@/hooks/use-session";
import { Card, Chip, Separator } from "@heroui/react";

export default function SettingsPage() {
  const { session } = useSession();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Workspace preferences. All premium features are included.
        </p>
      </div>

      <Card className="card-premium">
        <Card.Content className="divide-y divide-border p-0">
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">Plan</p>
              <p className="text-sm text-muted">Full stack · unlimited accounts</p>
            </div>
            <Chip color="success" variant="soft" size="sm">
              Free forever
            </Chip>
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">Signed in as</p>
              <p className="text-sm text-muted">{session?.user?.email}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="font-medium">Environment</p>
            <Separator className="my-3" />
            <ul className="space-y-1 text-sm text-muted">
              <li>• PostgreSQL via Drizzle ORM</li>
              <li>• Redis + BullMQ for publish workers</li>
              <li>• AES-256-GCM token encryption</li>
              <li>• Better Auth (Google + X only)</li>
              <li>• HeroUI + Tailwind CSS v4 (light)</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
