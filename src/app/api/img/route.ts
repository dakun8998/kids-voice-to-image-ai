import { type NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

// 配置fal client
fal.config({
  credentials: process.env.FAL_API_KEY_IMG,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '请提供文字描述' },
        { status: 400 }
      );
    }

    // 优化提示词
    const enhancedPrompt = `${prompt}, 儿童友好, 可爱风格, 卡通插画, 明亮色彩, 温馨画面`;

    console.log('开始图片生成...', enhancedPrompt);

    // 调用fal图片生成API
    const result = await fal.subscribe("fal-ai/hidream-i1-fast", {
      input: {
        prompt: enhancedPrompt
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("图片生成中...", update.logs?.map(log => log.message));
        }
      },
    });

    console.log('图片生成结果:', result.data);

    const imageUrl = result.data?.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error('未能生成图片');
    }

    // 记录统计信息
    console.log(`图片生成成功: ${prompt} -> ${imageUrl}`);

    return NextResponse.json({
      imageUrl,
      prompt: prompt,
      success: true,
      requestId: result.requestId
    });

  } catch (error) {
    console.error('图片生成API错误:', error);

    // 根据错误类型返回不同的友好提示
    let errorMessage = '网络有点慢，再试一次吧！🔄';

    if (error instanceof Error) {
      if (error.message.includes('safety')) {
        errorMessage = '这个想法有点特别，换个试试吧！✨';
      } else if (error.message.includes('timeout')) {
        errorMessage = '图片制作需要一点时间，请稍等！⏰';
      }
    }

    return NextResponse.json(
      {
        error: '图片生成失败',
        message: errorMessage,
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// 设置超时处理
export const maxDuration = 15; // 15秒超时
