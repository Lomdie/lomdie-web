"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Heading,
  Link,
  LinkImage,
  Bookmark,
  List,
  ListProperties,
  TodoList,
  Indent,
  IndentBlock,
  BlockQuote,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TableCaption,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
  AutoImage,
  PictureEditing,
  MediaEmbed,
  HtmlEmbed,
  GeneralHtmlSupport,
  Alignment,
  Font,
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Highlight,
  HorizontalLine,
  CodeBlock,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  FindAndReplace,
  WordCount,
  Fullscreen,
  type Editor,
} from "ckeditor5";
import type { UploadAdapter, FileLoader, UploadResponse } from "ckeditor5";
import { useRef } from "react";

import "ckeditor5/ckeditor5.css";

class SupabaseUploadAdapter implements UploadAdapter {
  private loader: FileLoader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  async upload(): Promise<UploadResponse> {
    const file = await this.loader.file;
    if (!file) {
      throw new Error("Aucun fichier à envoyer.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/blog/upload-image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("L'envoi de l'image a échoué.");
    }

    const data = await response.json();
    return { default: data.url };
  }

  abort() {
    // Rien à annuler côté client : la requête fetch se termine naturellement.
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const wordCountRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rich-text-editor w-full min-w-0 overflow-hidden rounded-lg border border-border/70 [&_.ck-editor__editable]:min-h-[400px] [&_.ck-editor__editable]:!bg-white [&_.ck-toolbar]:!rounded-t-lg [&_.ck-toolbar]:!border-border [&_.ck-content]:!bg-white [&_.ck-editor__editable]:!rounded-b-lg [&_.ck-editor__editable]:!border-border [&_.ck-editor]:!w-full [&_.ck-toolbar]:!flex-wrap">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_event, editor) => onChange(editor.getData())}
        onReady={(editor: Editor) => {
          const fileRepository = editor.plugins.get("FileRepository");
          fileRepository.createUploadAdapter = (loader: FileLoader) =>
            new SupabaseUploadAdapter(loader);

          const wordCount = editor.plugins.get("WordCount");
          if (wordCountRef.current) {
            wordCountRef.current.innerHTML = "";
            wordCountRef.current.appendChild(wordCount.wordCountContainer);
          }
        }}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Autoformat,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Heading,
            Link,
            LinkImage,
            Bookmark,
            List,
            ListProperties,
            TodoList,
            Indent,
            IndentBlock,
            BlockQuote,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            TableCaption,
            Image,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            ImageUpload,
            ImageInsert,
            ImageInsertViaUrl,
            AutoImage,
            PictureEditing,
            MediaEmbed,
            HtmlEmbed,
            GeneralHtmlSupport,
            Alignment,
            Font,
            FontColor,
            FontBackgroundColor,
            FontSize,
            FontFamily,
            Highlight,
            HorizontalLine,
            CodeBlock,
            RemoveFormat,
            SourceEditing,
            SpecialCharacters,
            SpecialCharactersEssentials,
            FindAndReplace,
            WordCount,
            Fullscreen,
          ],
          toolbar: [
            "fullscreen",
            "findAndReplace",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "removeFormat",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "highlight",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
            "|",
            "link",
            "bookmark",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "htmlEmbed",
            "horizontalLine",
            "specialCharacters",
            "|",
            "insertImage",
            "|",
            "codeBlock",
            "sourceEditing",
            "|",
            "undo",
            "redo",
          ],
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
              "|",
              "resizeImage",
            ],
            insert: {
              integrations: ["upload", "assetManager", "url"],
            },
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
              "toggleTableCaption",
            ],
          },
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true,
              },
            ],
          },
          fontFamily: {
            supportAllValues: true,
          },
          fontSize: {
            options: [10, 12, 14, "default", 18, 20, 24, 28, 32],
            supportAllValues: true,
          },
        }}
      />
      <div
        ref={wordCountRef}
        className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground [&_.ck-word-count]:flex [&_.ck-word-count]:gap-3"
      />
    </div>
  );
}
