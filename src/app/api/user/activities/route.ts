import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取用户活动记录
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    
    // 验证会话
    const { data: session } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!session) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 获取活动记录
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', session.user_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取活动记录失败:', error);
      return NextResponse.json({ error: '获取活动记录失败' }, { status: 500 });
    }

    // 获取统计信息
    const { data: stats } = await supabase
      .from('user_activities')
      .select('action')
      .eq('user_id', session.user_id);

    const actionCounts = (stats || []).reduce((acc, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      activities: activities || [],
      stats: {
        total: stats?.length || 0,
        literatureSplit: actionCounts['literature_split'] || 0,
        batchAnalysis: actionCounts['batch_analysis'] || 0,
        clusterOutline: actionCounts['cluster_outline'] || 0,
        paragraphWrite: actionCounts['paragraph_write'] || 0,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 记录用户活动
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    
    // 验证会话
    const { data: session } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!session) {
      return NextResponse.json({ error: '会话已过期' }, { status: 401 });
    }

    const body = await request.json();
    const { action, toolName, description, metadata } = body;

    if (!action || !toolName) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 插入活动记录
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: session.user_id,
        action,
        tool_name: toolName,
        description,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('记录活动失败:', error);
      return NextResponse.json({ error: '记录活动失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, activity: data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
