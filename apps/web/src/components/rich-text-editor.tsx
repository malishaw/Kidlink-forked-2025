"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  onBlur,
  placeholder = "Start writing...",
  className,
}: RichTextEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onBlur: () => {
      onBlur?.();
    },
    onCreate: () => {
      setIsEditorReady(true);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2",
          "[&_p]:my-2",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2",
        ),
      },
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && isEditorReady && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, isEditorReady, value]);

  // Toolbar button handler - uses onMouseDown to preserve selection
  const handleToolbarClick = useCallback((action: () => void) => {
    return (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent blur
      action();
    };
  }, []);

  // Show loading skeleton while editor initializes
  if (!editor || !isEditorReady) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-muted rounded" />
          ))}
        </div>
        <div className="min-h-[200px] rounded-md border border-input bg-background animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleBold().run(),
          )}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-accent")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleItalic().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-accent",
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleHeading({ level: 2 }).run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 }) && "bg-accent",
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleHeading({ level: 3 }).run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 3 }) && "bg-accent",
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleBulletList().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-accent",
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleOrderedList().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") && "bg-accent",
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() =>
            editor.chain().toggleBlockquote().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("blockquote") && "bg-accent",
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() => editor.chain().undo().run())}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={handleToolbarClick(() => editor.chain().redo().run())}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
