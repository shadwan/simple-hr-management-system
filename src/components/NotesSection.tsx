"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { addNote, deleteNote, type EntityType } from "@/app/(authenticated)/notes/actions";
import type { Note } from "@/db/schema";

interface NotesSectionProps {
  entityType: EntityType;
  entityId: number;
  notes: Note[];
}

export function NotesSection({ entityType, entityId, notes }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    startTransition(async () => {
      await addNote(entityType, entityId, newNote);
      setNewNote("");
    });
  };

  const handleDeleteNote = (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    startTransition(async () => {
      await deleteNote(noteId, entityType, entityId);
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Notes ({notes.length})
      </h2>

      {/* Add Note Form */}
      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="input min-h-[80px] mb-2"
          disabled={isPending}
        />
        <button
          onClick={handleAddNote}
          disabled={isPending || !newNote.trim()}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {isPending ? "Adding..." : "Add Note"}
        </button>
      </div>

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-3 relative group">
              <p className="text-gray-700 whitespace-pre-wrap pr-8">{note.content}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(note.createdAt)}</p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                disabled={isPending}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No notes yet. Add one above.</p>
      )}
    </div>
  );
}

// Component for adding notes during entity creation
interface NotesInputProps {
  notes: string[];
  onChange: (notes: string[]) => void;
}

export function NotesInput({ notes, onChange }: NotesInputProps) {
  const [currentNote, setCurrentNote] = useState("");

  const handleAddNote = () => {
    if (!currentNote.trim()) return;
    onChange([...notes, currentNote.trim()]);
    setCurrentNote("");
  };

  const handleRemoveNote = (index: number) => {
    onChange(notes.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      
      {/* Existing notes */}
      {notes.length > 0 && (
        <div className="space-y-2 mb-4">
          {notes.map((note, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 relative group">
              <p className="text-gray-700 whitespace-pre-wrap pr-8">{note}</p>
              <button
                type="button"
                onClick={() => handleRemoveNote(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                title="Remove note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add note input */}
      <div className="flex gap-2">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note... (Press Enter to add)"
          className="input min-h-[60px] flex-1"
          rows={2}
        />
        <button
          type="button"
          onClick={handleAddNote}
          disabled={!currentNote.trim()}
          className="btn btn-secondary self-end disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">Press Enter to add note, Shift+Enter for new line</p>
      
      {/* Hidden inputs to submit notes with form */}
      {notes.map((note, index) => (
        <input key={index} type="hidden" name="notes" value={note} />
      ))}
    </div>
  );
}
