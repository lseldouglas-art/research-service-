'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  LogOut, 
  History, 
  Loader2,
  FileText,
  Split,
  GitBranch,
  PenTool,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginDialog } from '@/components/auth/LoginDialog';

interface Activity {
  id: string;
  action: string;
  tool_name: string;
  description: string;
  metadata: any;
  created_at: string;
}

interface UserStats {
  total: number;
  literatureSplit: number;
  batchAnalysis: number;
  clusterOutline: number;
  paragraphWrite: number;
}

export function UserMenu() {
  const { user, loading, isLoggedIn, logout, getActivities } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 加载历史记录
  useEffect(() => {
    if (showHistory && isLoggedIn) {
      setLoadingHistory(true);
      getActivities(50).then((data) => {
        if (data) {
          setActivities(data.activities);
          setStats(data.stats);
        }
        setLoadingHistory(false);
      });
    }
  }, [showHistory, isLoggedIn, getActivities]);

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  // 获取操作图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'literature_split':
        return <Split className="w-4 h-4 text-green-500" />;
      case 'batch_analysis':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'cluster_outline':
        return <GitBranch className="w-4 h-4 text-indigo-500" />;
      case 'paragraph_write':
        return <PenTool className="w-4 h-4 text-pink-500" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  // 获取操作名称
  const getActionName = (action: string) => {
    const names: Record<string, string> = {
      literature_split: '文献分割',
      batch_analysis: '分批分析',
      cluster_outline: '聚类大纲',
      paragraph_write: '段落撰写',
      login: '登录',
    };
    return names[action] || action;
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setShowLogin(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <User className="w-4 h-4 mr-1" />
          登录
        </Button>
        <LoginDialog 
          open={showLogin} 
          onOpenChange={setShowLogin}
          onLoginSuccess={(userData) => {
            setShowLogin(false);
            window.location.reload();
          }}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.nickname} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.nickname?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <span className="hidden sm:inline">{user?.nickname || '用户'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.nickname || '用户'}</span>
              <span className="text-xs text-slate-500 font-normal">
                {user?.provider === 'wechat' ? '微信登录' : 
                 user?.provider === 'qq' ? 'QQ登录' : '游客模式'}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowHistory(true)}>
            <History className="w-4 h-4 mr-2" />
            使用记录
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 历史记录弹窗 */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              使用记录
            </DialogTitle>
          </DialogHeader>

          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* 统计信息 */}
              {stats && (
                <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.literatureSplit}</p>
                    <p className="text-xs text-slate-500">文献分割</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.batchAnalysis}</p>
                    <p className="text-xs text-slate-500">分批分析</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{stats.clusterOutline}</p>
                    <p className="text-xs text-slate-500">聚类大纲</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{stats.paragraphWrite}</p>
                    <p className="text-xs text-slate-500">段落撰写</p>
                  </div>
                </div>
              )}

              {/* 活动列表 */}
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {getActionName(activity.action)}
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatTime(activity.created_at)}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {activity.description}
                          </p>
                        )}
                        {activity.metadata && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                              <span 
                                key={key}
                                className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded"
                              >
                                {key}: {String(value).slice(0, 20)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无使用记录</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
