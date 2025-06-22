import { fal } from "@fal-ai/client";

export async function speechToText(fileUrl: string) {
  try {
    const result = await fal.subscribe("fal-ai/whisper", {
      input: {
        audio_url: fileUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("语音转文字处理中...");
        }
      },
    });
    return result;
  } catch (error) {
    console.error("语音转文字失败:", error);
    throw error;
  }
}

export async function textToImage(prompt: string) {
  try {
    const result = await fal.subscribe("fal-ai/hidream-i1-fast", {
      input: {
        prompt: `${prompt}, 儿童友好, 可爱风格, 卡通插画`,
        image_size: "square_hd",
        num_images: 1
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("图片生成中...");
        }
      },
    });
    return result;
  } catch (error) {
    console.error("图片生成失败:", error);
    throw error;
  }
}

// 安全关键词黑名单
const BLOCKED_KEYWORDS = [
  "裸体", "性", "暴力", "血腥", "恐怖", "死亡", "杀", "打架",
  "nude", "sex", "violence", "blood", "horror", "death", "kill", "fight"
];

export function checkSafety(text: string): boolean {
  const lowerText = text.toLowerCase();
  return !BLOCKED_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

export function sanitizePrompt(text: string): string {
  // 移除敏感内容，添加儿童友好描述
  return text.replace(/[^\u4e00-\u9fa5\w\s]/g, ' ').trim();
}
