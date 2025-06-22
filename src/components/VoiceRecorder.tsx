'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isLoading: boolean;
}

export function VoiceRecorder({ onTranscription, isLoading }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      // 尝试多种音频格式，选择浏览器支持的
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // 使用默认格式
          }
        }
      }

      console.log('使用音频格式:', mimeType);

      const mediaRecorder = new MediaRecorder(stream,
        mimeType ? { mimeType } : {}
      );

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      const stopRecordingInternal = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      };

      const sendAudioForTranscriptionInternal = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
          toast.info('正在转换语音为文字... 🧠');

          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch('/api/stt', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (result.success) {
            toast.success(`识别成功：${result.text} ✨`);
            toast.info('正在根据文字生成图片... 🎨');

            // 将识别的文字传递给图片生成
            onTranscription(result.text);
          } else {
            console.error('API返回错误:', result);
            toast.error(result.message || '语音识别失败，请重试 🔄');

            // 如果有详细错误信息，也显示在控制台
            if (result.details) {
              console.error('错误详情:', result.details);
            }
          }
        } catch (error) {
          console.error('语音转文字失败:', error);
          toast.error('网络有点慢，再试一次吧！🔄');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // 停止所有音频轨道
        for (const track of stream.getTracks()) {
          track.stop();
        }

        // 自动发送语音转文字
        await sendAudioForTranscriptionInternal(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 10秒后自动停止录音
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecordingInternal();
        }
      }, 10000);

      toast.success('开始录音！说出你想画的东西 🎤 (最长10秒)');

    } catch (error) {
      console.error('录音失败:', error);
      toast.error('无法访问麦克风，请检查权限设置 🎙️');
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      toast.info('正在转换语音为文字... 🧠');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`识别成功：${result.text} ✨`);
        toast.info('正在根据文字生成图片... 🎨');

        // 将识别的文字传递给图片生成
        onTranscription(result.text);
      } else {
        console.error('API返回错误:', result);
        toast.error(result.message || '语音识别失败，请重试 🔄');

        // 如果有详细错误信息，也显示在控制台
        if (result.details) {
          console.error('错误详情:', result.details);
        }
      }
    } catch (error) {
      console.error('语音转文字失败:', error);
      toast.error('网络有点慢，再试一次吧！🔄');
    } finally {
      setIsProcessing(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isLoading || isProcessing}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-16 h-16 p-0 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Mic className="w-8 h-8" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 p-0 shadow-lg animate-pulse"
          >
            <Square className="w-8 h-8" />
          </Button>
        )}

        {audioUrl && (
          <Button
            onClick={playRecording}
            variant="outline"
            size="lg"
            className="rounded-full"
            disabled={isLoading || isProcessing}
          >
            🔊 播放录音
          </Button>
        )}
      </div>

      <div className="text-center">
        {isRecording && (
          <p className="text-lg text-pink-600 font-medium animate-bounce">
            正在录音中... 🎙️
          </p>
        )}
        {isProcessing && (
          <p className="text-lg text-blue-600 font-medium">
            正在转换语音为文字... 🧠
          </p>
        )}
        {!isRecording && !isProcessing && (
          <div>
            <p className="text-gray-600 text-lg">
              点击话筒开始说话 🎤
            </p>
            <p className="text-gray-500 text-sm mt-1">
              最长可录音10秒钟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
