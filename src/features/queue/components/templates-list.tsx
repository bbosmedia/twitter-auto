"use client";

import { Card, CardContent, Button, Spinner } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";

export function TemplatesList() {
  const templates: any[] = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Post Templates</h2>
        <Button variant="primary">
          <Plus size={16} className="mr-1" />
          New Template
        </Button>
      </div>

      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-default-500 mb-4">No templates yet</p>
            <Button variant="primary">Create Your First Template</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-default-500 mt-1">
                      {template.content}
                    </p>
                  </div>
                  <Button size="sm" variant="danger" isIconOnly>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
