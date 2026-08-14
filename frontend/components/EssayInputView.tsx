"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bold,
  Copy,
  FileText,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Send,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react";

export interface EssayInputViewProps {
  onAnalyze?: (text: string) => void;
  onSubmit?: (text: string) => void;
  error?: string | null;
}

const SAMPLE_ESSAY = `Technology has fundamentally changed how I approach difficult problems.

During my first software project, I assumed that writing more code would automatically produce a better result. Instead, repeated errors forced me to slow down, read documentation, test smaller pieces, and question my assumptions.

That experience taught me that technical ability is not just about knowing tools. It is also about being patient enough to understand why something fails. Since then, I have become more comfortable with uncertainty, experimentation, and learning from mistakes.`;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function textToHtml(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function getPlainText(element: HTMLElement | null) {
  if (!element) return "";
  return element.innerText
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export const EssayInputView: React.FC<EssayInputViewProps> = ({
  onAnalyze,
  onSubmit,
  error,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  const sync = () => {
    setText(getPlainText(editorRef.current));
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
  };

  const command = (name: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    sync();
  };

  const loadSample = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = textToHtml(SAMPLE_ESSAY);
    setText(SAMPLE_ESSAY);
    editorRef.current.focus();
  };

  const clearEditor = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = "";
    setText("");
    editorRef.current.focus();
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = "";
  }, []);

  const submitEssay = () => {
    const value = getPlainText(editorRef.current);
    if (!value) return;
    onAnalyze?.(value);
    onSubmit?.(value);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          VeritasAI Essay Analyzer
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-on-surface-variant">
          Write or paste your essay, format it for editing, then run the statistical diagnostic on the underlying plain text.
        </p>
      </div>

      {error && (
        <div className="flex gap-3 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div><b>Analysis Error:</b> {error}</div>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitEssay();
        }}
        className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <FileText className="h-4 w-4 text-primary" />
            Rich essay editor
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("bold")} className={`editor-tool ${bold ? "bg-primary/15 text-primary" : ""}`} title="Bold"><Bold className="h-4 w-4" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("italic")} className={`editor-tool ${italic ? "bg-primary/15 text-primary" : ""}`} title="Italic"><Italic className="h-4 w-4" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("insertUnorderedList")} className="editor-tool" title="Bullet list"><List className="h-4 w-4" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("insertOrderedList")} className="editor-tool" title="Numbered list"><ListOrdered className="h-4 w-4" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("formatBlock", "blockquote")} className="editor-tool" title="Quote"><Quote className="h-4 w-4" /></button>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => command("removeFormat")} className="editor-tool" title="Remove formatting"><RemoveFormatting className="h-4 w-4" /></button>
            <span className="mx-1 h-6 w-px bg-outline-variant" />
            <button type="button" onClick={copyText} className="editor-tool" title="Copy plain text"><Copy className="h-4 w-4" /></button>
            <button type="button" onClick={() => command("undo")} className="editor-tool" title="Undo"><Undo2 className="h-4 w-4" /></button>
            <button type="button" onClick={() => command("redo")} className="editor-tool" title="Redo"><Redo2 className="h-4 w-4" /></button>
            <button type="button" onClick={loadSample} className="ml-1 flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-container-high"><Sparkles className="h-3.5 w-3.5" />Load Sample</button>
            {text && <button type="button" onClick={clearEditor} className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-error/10 hover:text-error"><Trash2 className="h-3.5 w-3.5" />Clear</button>}
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onKeyUp={sync}
          onMouseUp={sync}
          onFocus={sync}
          onPaste={(event) => {
            event.preventDefault();
            const plain = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, plain);
            sync();
          }}
          role="textbox"
          aria-multiline="true"
          data-placeholder="Write or paste your admissions essay here..."
          onKeyDown={(event) => {
            // Enter creates a new paragraph. Ctrl/Cmd + Enter submits the essay.
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              submitEssay();
              return;
            }

            if (event.key === "Enter" && !event.shiftKey) {
              // Explicitly insert a paragraph so Enter works consistently
              // across browsers inside the contentEditable editor.
              event.preventDefault();
              document.execCommand("insertParagraph");
              sync();
            }
          }}
          className="rich-editor min-h-[420px] max-h-[560px] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low p-5 font-serif text-lg leading-8 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:p-7"
        />

        <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <div className="flex gap-4 font-mono text-xs text-on-surface-variant">
            <span>Words: <b className="text-on-surface">{words}</b></span>
            <span>Characters: <b className="text-on-surface">{text.length}</b></span>
            <span className="hidden text-on-surface-variant sm:inline">Enter = new paragraph · Ctrl/Cmd + Enter = analyze</span>
          </div>
          <button type="submit" disabled={!text.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            <span>Analyze Essay</span><Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
