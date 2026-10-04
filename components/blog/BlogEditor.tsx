'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
  Minus,
  Code,
  Eye,
} from 'lucide-react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlValue, setHtmlValue] = useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-burntSienna underline hover:text-fadedGold transition-colors',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlValue(html)
      onChange(html)
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none min-h-[400px] p-6 focus:outline-none prose-headings:font-heading prose-headings:text-sepiaInk prose-p:text-warmCream-800 prose-p:leading-relaxed prose-a:text-burntSienna prose-strong:text-sepiaInk prose-blockquote:border-fadedGold prose-blockquote:text-warmCream-700 prose-ul:text-warmCream-800 prose-ol:text-warmCream-800 prose-li:marker:text-fadedGold',
      },
    },
  })

  if (!editor) {
    return (
      <div className="bg-white/60 rounded-2xl border border-warmCream-200 p-8 text-center text-warmCream-500">
        Loading editor…
      </div>
    )
  }

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching back to Visual Mode — load HTML into TipTap editor
      editor.commands.setContent(htmlValue)
      onChange(htmlValue)
      setIsHtmlMode(false)
    } else {
      // Switching to HTML Mode — get current TipTap HTML
      const currentHtml = editor.getHTML()
      setHtmlValue(currentHtml)
      setIsHtmlMode(true)
    }
  }

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setHtmlValue(val)
    onChange(val)
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-sepiaInk text-white'
          : 'text-warmCream-600 hover:bg-warmCream-100 hover:text-sepiaInk'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-warmCream-200 shadow-soft overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-warmCream-200 bg-warmCream-50/50">
        {!isHtmlMode && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-warmCream-300 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-warmCream-300 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <Quote size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-warmCream-300 mx-1" />

            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link">
              <LinkIcon size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus size={18} />
            </ToolbarButton>

            <div className="flex-1" />

            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
              <Undo size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
              <Redo size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-warmCream-300 mx-1" />
          </>
        )}

        {/* Source HTML Mode Toggle */}
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-mono transition-colors ${
            isHtmlMode
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-warmCream-200/80 text-sepiaInk hover:bg-warmCream-300'
          }`}
          title={isHtmlMode ? 'Switch to Visual Editor' : 'Switch to HTML Code Mode'}
        >
          {isHtmlMode ? (
            <>
              <Eye size={16} />
              <span>Visual Editor</span>
            </>
          ) : (
            <>
              <Code size={16} />
              <span>HTML Source Code</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content vs HTML Source Textarea */}
      {isHtmlMode ? (
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          placeholder="Paste or write HTML code here..."
          className="w-full min-h-[400px] p-6 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-y"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
