import { NextRequest, NextResponse } from 'next/server';

// 临时存储用户反馈（生产环境应使用数据库）
let feedbacks: Array<{
  id: string;
  name: string;
  content: string;
  createdAt: string;
}> = [];

// 获取反馈列表
export async function GET() {
  return NextResponse.json({
    success: true,
    data: feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

// 提交新反馈
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请输入反馈内容' },
        { status: 400 }
      );
    }

    const feedback = {
      id: Date.now().toString(),
      name: name && name.trim() !== '' ? name.trim() : '匿名用户',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    feedbacks.unshift(feedback);

    // 只保留最近100条反馈
    if (feedbacks.length > 100) {
      feedbacks = feedbacks.slice(0, 100);
    }

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('提交反馈失败:', error);
    return NextResponse.json(
      { success: false, error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
