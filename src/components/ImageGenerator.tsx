'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGeneratorProps {
  prompt: string;
  onNewGeneration: () => void;
}

export function ImageGenerator({ prompt, onNewGeneration }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateImage = useCallback(async (textPrompt: string) => {
    if (!textPrompt.trim()) {
      toast.error('请先说出或输入你想画的内容！');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setImageUrl(null);

    // 模拟进度条动画
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch('/api/img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      const result = await response.json();

      if (result.success) {
        setImageUrl(result.imageUrl);
        setProgress(100);
        toast.success('画作完成！ ✨🎨');

        // 记录统计
        console.log('Generation success:', { prompt: textPrompt, duration: Date.now() });
      } else {
        throw new Error(result.message || '图片生成失败');
      }
    } catch (error) {
      console.error('图片生成失败:', error);
      toast.error(error instanceof Error ? error.message : '网络有点慢，再试一次吧！🔄');
      setProgress(0);
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  }, []);

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `我的画作-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('图片已保存！📱');
    } catch (error) {
      console.error('下载失败:', error);
      toast.error('下载失败，请长按图片保存 📱');
    }
  };

  // 自动生成图片当prompt改变时
  useEffect(() => {
    if (prompt?.trim()) {
      generateImage(prompt);
    }
  }, [prompt, generateImage]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 进度条 */}
      {isGenerating && (
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-yellow-500 mr-2 animate-spin" />
            <span className="text-lg font-medium text-gray-700">
              正在画画中... {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 图片显示 */}
      {imageUrl && (
        <Card className="overflow-hidden shadow-xl border-4 border-yellow-200">
          <CardContent className="p-0">
            <img
              src={imageUrl}
              alt={`根据"${prompt}"生成的图片`}
              className="w-full h-auto max-h-96 object-cover"
              onError={() => {
                toast.error('图片加载失败 😿');
                setImageUrl(null);
              }}
            />

            {/* 图片下方的操作按钮 */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-pink-50">
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => {
                    onNewGeneration();
                    generateImage(prompt);
                  }}
                  disabled={isGenerating}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  再来一张
                </Button>

                <Button
                  onClick={downloadImage}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-green-400 text-green-600 hover:bg-green-50 rounded-full px-6 py-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  保存图片
                </Button>
              </div>

              {prompt && (
                <p className="text-center text-sm text-gray-600 mt-3 italic">
                  "{ prompt }"
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 首次提示 */}
      {!imageUrl && !isGenerating && prompt && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex items-center justify-center p-8">
            <Button
              onClick={() => generateImage(prompt)}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8 py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              开始画画
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
