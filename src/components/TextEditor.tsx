// src/Tiptap.tsx
"use client";
import {
  useEditor,
  EditorContent,
  Editor,
  useEditorState,
} from "@tiptap/react";
// import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  BubbleMenu,
  FloatingMenu,
  BubbleMenu as TiptopBubbleMenu,
} from "@tiptap/react/menus";
import { Toggle } from "./ui/toggle";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowBigDown,
  BoldIcon,
  BracketsIcon,
  BrushCleaning,
  Code,
  FlipVertical2,
  ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TiptapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ], // define your extension array
    editorProps: {
      attributes: {
        class:
          "prose dark:pros-invert prose-sm sm:prose-base focus:outline-none max-w-none min-h-45 border border-amber-400 rounded p-2 m-2",
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="p-1 rounded-lg bg-white border border-cyan-600">
      {editor && (
        <div className="pt-1">
          <ToolBar editor={editor} />
          <BubbleMenu editor={editor} />
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

const ToolBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (context) => {
      return {
        // Text formatting
        isBold: context.editor.isActive("bold") ?? false,
        isUnderline: context.editor.isActive("underline") ?? false,
        canBold: context.editor.can().chain().toggleBold().run() ?? false,
        isItalic: context.editor.isActive("italic") ?? false,
        canItalic: context.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: context.editor.isActive("strike") ?? false,
        canStrike: context.editor.can().chain().toggleStrike().run() ?? false,
        isCode: context.editor.isActive("code") ?? false,
        isHighLight: context.editor.isActive("highlight") ?? false,
        canCode: context.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks:
          context.editor.can().chain().unsetAllMarks().run() ?? false,

        // Block types
        isParagraph: context.editor.isActive("paragraph") ?? false,
        isHeading2: context.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: context.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: context.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: context.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: context.editor.isActive("heading", { level: 6 }) ?? false,

        // Lists and blocks
        isBulletList: context.editor.isActive("bulletList") ?? false,
        isOrderedList: context.editor.isActive("orderedList") ?? false,
        isCodeBlock: context.editor.isActive("codeBlock") ?? false,
        isBlockquote: context.editor.isActive("blockquote") ?? false,

        // History
        canUndo: context.editor.can().chain().undo().run() ?? false,
        canRedo: context.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  const handleHeadingChange = (value: string | null) => {
    if (!value) return;

    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value.replace("heading", "")) as
        | 1
        | 2
        | 3
        | 4
        | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  return (
    <div>
      {/* <TiptopBubbleMenu
        editor={editor}
        className="bg-background flex items-center rounded-md border shadow"
      >
        <Toggle
          size="sm"
          pressed={editorState.isBold}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle Bold"
        >
          <BoldIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle Italic"
        >
          <ItalicIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Toggle Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isCode}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.canClearMarks}
          onPressedChange={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <BrushCleaning />
        </Toggle>
        <Select
          onValueChange={handleHeadingChange}
          value={
            editorState.isHeading2
              ? "heading2"
              : editorState.isHeading3
                ? "heading3"
                : editorState.isHeading4
                  ? "heading4"
                  : editorState.isHeading5
                    ? "heading5"
                    : editorState.isHeading6
                      ? "heading6"
                      : "paragraph"
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="heading2">Heading 1</SelectItem>
              <SelectItem value="heading3">Heading 2</SelectItem>
              <SelectItem value="heading4">Heading 3</SelectItem>
              <SelectItem value="heading5">Heading 4</SelectItem>
              <SelectItem value="heading6">Heading 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Toggle
          size="sm"
          pressed={editorState.isBulletList}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Unordered List"
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isOrderedList}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isCodeBlock}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code Block"
        >
          <BracketsIcon />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isBlockquote}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          aria-label="Block Quote"
        >
          <Quote />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
          aria-label="Rule Horizon"
        >
          <FlipVertical2 />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().setHardBreak().run()}
          aria-label="Break"
        >
          <ArrowBigDown />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          <Undo2 />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          <Redo2 />
        </Toggle>
      </TiptopBubbleMenu> */}
      <div className="flex items-center justify-start">
        <Toggle
          size="sm"
          pressed={editorState.isBold}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle Bold"
        >
          <BoldIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle Italic"
        >
          <ItalicIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Toggle Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isCode}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.canClearMarks}
          onPressedChange={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <BrushCleaning />
        </Toggle>
        <Select
          onValueChange={handleHeadingChange}
          value={
            editorState.isHeading2
              ? "heading2"
              : editorState.isHeading3
                ? "heading3"
                : editorState.isHeading4
                  ? "heading4"
                  : editorState.isHeading5
                    ? "heading5"
                    : editorState.isHeading6
                      ? "heading6"
                      : "paragraph"
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="heading2">Heading 1</SelectItem>
              <SelectItem value="heading3">Heading 2</SelectItem>
              <SelectItem value="heading4">Heading 3</SelectItem>
              <SelectItem value="heading5">Heading 4</SelectItem>
              <SelectItem value="heading6">Heading 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Toggle
          size="sm"
          //   pressed={}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          aria-label="Left"
        >
          <AlignLeft />
        </Toggle>
        <Toggle
          size="sm"
          //   pressed={}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          aria-label="Center"
        >
          <AlignCenter />
        </Toggle>
        <Toggle
          size="sm"
          //   pressed={}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          aria-label="Right"
        >
          <AlignRight />
        </Toggle>
        <Toggle
          size="sm"
          //   pressed={}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          aria-label="Justify"
        >
          <AlignJustify />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editorState.isCodeBlock}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code Block"
        >
          <BracketsIcon />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isBulletList}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Unordered List"
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isOrderedList}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editorState.isBlockquote}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          aria-label="Block Quote"
        >
          <Quote />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
          aria-label="Rule Horizon"
        >
          <FlipVertical2 />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().setHardBreak().run()}
          aria-label="Break"
        >
          <ArrowBigDown />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          <Undo2 />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          <Redo2 />
        </Toggle>
      </div>
    </div>
  );
};
