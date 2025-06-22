'use client';

import { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ExampleCards } from '@/components/ExampleCards';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/ui/button';
import { Settings, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);

  const handlePromptSubmit = (prompt: string) => {
    setCurrentPrompt(prompt);
    setIsGenerating(true);
  };

  const handleNewGeneration = () => {
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      {/* 头部导航 */}
      <header className="relative p-4 bg-white/80 backdrop-blur-sm shadow-sm border-b-2 border-yellow-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bounce">🎨</div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              小画家AI
            </h1>
          </div>

          {/* 家长指南 */}
          <Link href="/parents">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="w-4 h-4 mr-1" />
              家长指南
            </Button>
          </Link>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 欢迎区域 */}
        {!currentPrompt && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              说出你的想法 ✨
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              我来帮你画出来！
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              用你的声音或文字，创造出神奇的图片！语音会先转换成文字，再生成美丽的画作 🌈
            </p>
          </div>
        )}

        {/* 语音录制区域 - 提到最前面 */}
        {!currentPrompt && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-200 w-full max-w-md">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                🎤 点击说话
              </h3>
              <VoiceRecorder
                onTranscription={handlePromptSubmit}
                isLoading={isGenerating}
              />
            </div>
          </div>
        )}

        {/* 或者分隔线 */}
        {!currentPrompt && (
          <div className="flex items-center justify-center space-x-4 w-full max-w-md mx-auto mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 font-medium">或者</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        )}

        {/* 文字输入切换 */}
        {!currentPrompt && !showTextInput && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowTextInput(true)}
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 shadow-lg"
            >
              ✏️ 用文字描述
            </Button>
          </div>
        )}

        {/* 文字输入区域 */}
        {!currentPrompt && showTextInput && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-200 w-full max-w-md">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                ✏️ 写下你的想法
              </h3>
              <TextInput
                onSubmit={handlePromptSubmit}
                isLoading={isGenerating}
                placeholder="试试：穿宇航服的长颈鹿"
              />
              <div className="text-center mt-4">
                <Button
                  onClick={() => setShowTextInput(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                >
                  收起
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 示例卡片 - 移到后面，作为补充选项 */}
        {!currentPrompt && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                或者试试这些有趣的想法 💡
              </h4>
            </div>
            <ExampleCards
              onExampleClick={handlePromptSubmit}
              isLoading={isGenerating}
            />
          </div>
        )}

        {/* 图片生成区域 */}
        {currentPrompt && (
          <div className="mb-12">
            <ImageGenerator
              prompt={currentPrompt}
              onNewGeneration={handleNewGeneration}
            />

            {/* 重新开始按钮 */}
            <div className="text-center mt-8">
              <Button
                onClick={() => {
                  setCurrentPrompt('');
                  setIsGenerating(false);
                  setShowTextInput(false);
                }}
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
              >
                🔄 开始新的创作
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white/80 backdrop-blur-sm text-center py-6 text-gray-500 border-t-2 border-gray-100">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span>为孩子们制作</span>
          <Heart className="w-4 h-4 text-red-400" />
        </div>
        <p className="text-sm">安全、有趣、充满想象力的AI画画工具</p>
      </footer>
    </div>
  );
}
