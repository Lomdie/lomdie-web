"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlogPost } from "@/lib/actions/admin-blog";

export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Supprimer l'article ${title}`}
      onClick={() => {
        if (confirm(`Supprimer définitivement l'article "${title}" ?`)) {
          deleteBlogPost(id);
        }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
    </Button>
  );
}
