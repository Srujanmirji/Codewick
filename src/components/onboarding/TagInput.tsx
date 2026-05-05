"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SKILL_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Python", "Java", "Go",
  "UI Design", "UX Research", "Figma", "Node.js", "GraphQL", "REST APIs",
  "Machine Learning", "Data Science", "DevOps", "Docker", "AWS", "Firebase",
  "Flutter", "Swift", "Kotlin", "Rust", "C++", "SQL", "MongoDB",
  "Vue.js", "Angular", "Svelte", "Tailwind CSS", "Sass", "Git",
  "Photography", "Video Editing", "Copywriting", "SEO", "Marketing",
  "Public Speaking", "Leadership", "Project Management", "Agile",
];

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
}

export function TagInput({ tags, onChange, placeholder = "Type a skill...", max = 5 }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SKILL_SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  ).slice(0, 6);

  const addTag = (tag: string) => {
    if (tags.length >= max || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl min-h-[52px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all hover:bg-white/[0.07]">
        <AnimatePresence mode="popLayout">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-lg text-sm text-blue-300 font-inter font-medium"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {tags.length < max && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 outline-none font-inter text-sm"
          />
        )}
      </div>
      <p className="text-xs text-white/30 mt-1.5 font-inter text-right">{tags.length}/{max}</p>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && input.length > 0 && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 mt-1 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors font-inter"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
