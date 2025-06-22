import { type NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

// 配置fal client
const apiKey = process.env.FAL_API_KEY_STT;
console.log('API密钥配置:', apiKey ? '已配置' : '未配置', `${apiKey?.substring(0, 10)}...`);

fal.config({
  credentials: apiKey,
});

export async function POST(request: NextRequest) {
  try {
    console.log('API调用开始，Content-Type:', request.headers.get('content-type'));

    // 检查请求头
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
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
        { error: '没有找到音频文件' },
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

    if (audioFile.size < 1000) { // 提高最小文件大小限制到1KB
      return NextResponse.json(
        { error: '音频文件太小或无效，请重新录制', success: false },
        { status: 400 }
      );
    }

    // 验证音频文件类型
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: '文件类型错误，请上传音频文件', success: false },
        { status: 400 }
      );
    }

    // 将音频文件转换为base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${audioFile.type};base64,${base64Audio}`;

    console.log('开始语音转文字处理..., 数据URL长度:', dataUrl.length);

    // 调用fal语音转文字API
    const result = await fal.subscribe("fal-ai/whisper", {
      input: {
        audio_url: dataUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("语音转文字处理状态:", update.status);
        if (update.status === "IN_PROGRESS") {
          if (update.logs) {
            for (const log of update.logs) {
              console.log('处理日志:', log.message);
            }
          }
        }
      },
    });

    console.log('语音转文字结果:', result.data);

    const transcription = result.data?.text || '';

    if (!transcription) {
      throw new Error('未能识别语音内容，请尝试说清楚一些');
    }

    return NextResponse.json({
      text: transcription,
      success: true,
      requestId: result.requestId
    });

  } catch (error) {
    console.error('语音转文字API错误:', error);

    let errorMessage = '网络有点慢，再试一次吧！🔄';
    let statusCode = 500;

    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);

      if (error.message.includes('Content-Type')) {
        errorMessage = '请求格式错误，请重新录制 🎤';
        statusCode = 400;
      } else if (error.message.includes('audio')) {
        errorMessage = '音频格式有问题，请重新录制 🎤';
      } else if (error.message.includes('timeout')) {
        errorMessage = '处理时间太长，请说短一点 ⏰';
      } else if (error.message.includes('credentials') || error.message.includes('API')) {
        errorMessage = 'API配置问题，请联系管理员 🔧';
      }
    }

    return NextResponse.json(
      {
        error: '语音识别失败',
        message: errorMessage,
        details: error instanceof Error ? error.message : '未知错误',
        success: false
      },
      { status: statusCode }
    );
  }
}

// 设置超时处理 - 30秒以支持10秒录音的处理
export const maxDuration = 30;
