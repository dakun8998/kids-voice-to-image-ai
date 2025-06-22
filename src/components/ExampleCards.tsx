'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ExampleCardsProps {
  onExampleClick: (prompt: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  {
    id: 1,
    prompt: "穿宇航服的长颈鹿在太空中漂浮",
    emoji: "🦒🚀",
    color: "from-blue-400 to-purple-500",
    description: "太空长颈鹿"
  },
  {
    id: 2,
    prompt: "彩虹色的独角兽在云朵上奔跑",
    emoji: "🦄🌈",
    color: "from-pink-400 to-yellow-400",
    description: "彩虹独角兽"
  },
  {
    id: 3,
    prompt: "戴着帽子的小熊在森林里野餐",
    emoji: "🐻🎩",
    color: "from-green-400 to-blue-400",
    description: "野餐小熊"
  }
];

export function ExampleCards({ onExampleClick, isLoading }: ExampleCardsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          试试这些有趣的想法 ✨
        </h2>
        <p className="text-gray-600">
          点击下面的卡片，立即开始创作！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXAMPLES.map((example) => (
          <Card
            key={example.id}
            className="overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-yellow-300"
            onClick={() => onExampleClick(example.prompt)}
          >
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${example.color} p-6 text-white`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {example.emoji}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {example.description}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600 text-center mb-3">
                  "{example.prompt}"
                </p>

                <Button
                  disabled={isLoading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-full py-2 shadow-md transform hover:scale-105 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExampleClick(example.prompt);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  立即生成
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          或者说出你自己的想法 🎤 (最长10秒，先转文字再生图)
        </p>
      </div>
    </div>
  );
}
