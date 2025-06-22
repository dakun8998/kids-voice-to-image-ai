'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function TextInput({ onSubmit, isLoading, placeholder }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder || "试试：穿宇航服的长颈鹿"}
            className="text-lg h-12 rounded-full border-2 border-blue-200 focus:border-blue-400 px-4 shadow-md"
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <Button
          type="submit"
          disabled={!text.trim() || isLoading}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 p-0 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          {isLoading ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>

      <div className="text-center mt-2">
        <p className="text-sm text-gray-500">
          {text.length}/100 字符
        </p>
      </div>
    </div>
  );
}
