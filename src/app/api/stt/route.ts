import { type NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

// 配置fal client
const apiKey = process.env.FAL_API_KEY_STT;
console.log('STT API密钥配置:', apiKey ? '已配置' : '未配置');

if (!apiKey) {
  console.error('缺少FAL_API_KEY_STT环境变量');
}

fal.config({
  credentials: apiKey,
});

export async function POST(request: NextRequest) {
  try {
    console.log('STT API调用开始，Content-Type:', request.headers.get('content-type'));

    // 检查请求头
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      console.error('请求格式错误:', contentType);
      return NextResponse.json(
        { error: '请求格式错误', message: '需要multipart/form-data格式', success: false },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      console.log('未找到音频文件，FormData内容:', Array.from(formData.keys()));
      return NextResponse.json(
        { error: '没有找到音频文件', message: '请重新录制音频', success: false },
        { status: 400 }
      );
    }

    console.log('收到音频文件:', audioFile.name, audioFile.type, audioFile.size);

    // 验证音频文件大小和类型
    if (audioFile.size > 10 * 1024 * 1024) { // 10MB限制
      return NextResponse.json(
        { error: '音频文件太大，请录制更短的音频', success: false },
        { status: 400 }
      );
    }

    if (audioFile.size < 100) { // 降低最小文件大小限制
      console.log('音频文件太小:', audioFile.size);
      return NextResponse.json(
        { error: '音频文件太小或无效，请重新录制', success: false },
        { status: 400 }
      );
    }

    // 验证音频文件类型
    if (!audioFile.type.startsWith('audio/')) {
      console.log('文件类型错误:', audioFile.type);
      return NextResponse.json(
        { error: '文件类型错误，请上传音频文件', success: false },
        { status: 400 }
      );
    }

    console.log('准备上传音频文件到FAL...');

    // 使用FAL的文件上传功能
    let audioUrl;
    try {
      audioUrl = await fal.storage.upload(audioFile);
      console.log('音频文件上传成功:', audioUrl);
    } catch (uploadError) {
      console.error('文件上传失败:', uploadError);
      throw new Error('音频文件上传失败');
    }

    console.log('准备调用FAL Whisper API...');

    // 调用FAL Whisper API
    const result = await fal.subscribe("fal-ai/whisper", {
      input: {
        audio_url: audioUrl,
        task: "transcribe",
        language: "zh"
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("语音转文字处理状态:", update.status);
        if (update.logs) {
          for (const log of update.logs) {
            console.log('处理日志:', log.message);
          }
        }
      },
    });

    console.log('FAL API调用结果:', result);

    if (!result.data) {
      throw new Error('FAL API没有返回数据');
    }

    const transcription = result.data.text || '';

    if (!transcription.trim()) {
      throw new Error('未能识别到语音内容，请说得更清楚一些');
    }

    console.log('语音转文字成功:', transcription);

    return NextResponse.json({
      text: transcription.trim(),
      success: true,
      requestId: result.requestId
    });

  } catch (error) {
    console.error('语音转文字API错误:', error);

    let errorMessage = '语音识别失败，请重试 🔄';
    let statusCode = 500;

    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);

      if (error.message.includes('credentials') || error.message.includes('authentication')) {
        errorMessage = 'API密钥问题，请检查配置 🔧';
        statusCode = 401;
      } else if (error.message.includes('timeout')) {
        errorMessage = '处理时间太长，请说短一点 ⏰';
        statusCode = 408;
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = '使用配额不足，请稍后再试 📊';
        statusCode = 429;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '网络连接有问题，请检查网络 🌐';
        statusCode = 503;
      } else if (error.message.includes('音频文件上传失败')) {
        errorMessage = '音频上传失败，请重新录制 📤';
        statusCode = 500;
      } else if (error.message.includes('FAL API没有返回数据')) {
        errorMessage = 'API服务暂时不可用，请稍后再试 🔧';
        statusCode = 503;
      } else if (error.message.includes('未能识别到语音内容')) {
        errorMessage = '没有检测到语音，请说得更清楚一些 🎤';
        statusCode = 400;
      }
    }

    return NextResponse.json(
      {
        error: '语音识别失败',
        message: errorMessage,
        details: error instanceof Error ? error.message : '未知错误',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// 设置超时处理 - 60秒以支持更长的处理时间
export const maxDuration = 60;
