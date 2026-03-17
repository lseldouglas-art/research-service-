'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/Header';
import { 
  Heart,
  Coffee,
  Sparkles,
  Gift,
  CheckCircle2,
  Users,
  Star,
  MessageCircle,
  Mail,
  Send,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

const presetAmounts = [
  { value: 10, icon: Coffee, label: '一杯咖啡', description: '感谢您的支持' },
  { value: 20, icon: Heart, label: '一份爱心', description: '助力项目发展' },
  { value: 50, icon: Gift, label: '一份礼物', description: '推动功能迭代' },
  { value: 100, icon: Sparkles, label: '一份力量', description: '加速产品创新' },
];

interface Feedback {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 意见信箱状态
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // 加载反馈列表
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('加载反馈失败:', error);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9.]/g, '');
    setCustomAmount(numValue);
    setSelectedAmount(null);
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const handleDonate = () => {
    if (finalAmount <= 0) {
      alert('请选择或输入捐赠金额');
      return;
    }
    setShowQRCode(true);
  };

  // 提交反馈
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) {
      setFeedbackError('请输入反馈内容');
      return;
    }

    setIsSubmitting(true);
    setFeedbackError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedbackName,
          content: feedbackContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFeedbackContent('');
        setFeedbackName('');
        fetchFeedbacks();
      } else {
        setFeedbackError(data.error || '提交失败');
      }
    } catch (error) {
      setFeedbackError('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              支持我们持续前行
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              您的支持就是我们进步最大的动力
            </p>
            <Badge variant="secondary" className="mt-4 px-4 py-2">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              已收到 2,680+ 位用户支持
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：捐赠表单 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 预设金额 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-pink-500" />
                    选择捐赠金额
                  </CardTitle>
                  <CardDescription>
                    选择预设金额或自定义输入
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {presetAmounts.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleAmountSelect(item.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAmount === item.value
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-pink-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                          selectedAmount === item.value
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-lg">¥{item.value}</p>
                        <p className="text-xs text-slate-500">{item.label}</p>
                      </button>
                    ))}
                  </div>

                  {/* 自定义金额 */}
                  <div className="space-y-2">
                    <Label htmlFor="custom-amount">自定义金额</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                      <Input
                        id="custom-amount"
                        type="text"
                        placeholder="输入其他金额"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* 捐赠按钮 */}
                  <Button
                    onClick={handleDonate}
                    disabled={finalAmount <= 0}
                    className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    size="lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {finalAmount > 0 ? `捐赠 ¥${finalAmount}` : '请选择金额'}
                  </Button>
                </CardContent>
              </Card>

              {/* 支付方式 */}
              {showQRCode && (
                <Card className="border-pink-200 dark:border-pink-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-600">
                      <CheckCircle2 className="w-5 h-5" />
                      感谢您的支持
                    </CardTitle>
                    <CardDescription>
                      请扫描下方二维码完成支付
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 微信支付 */}
                      <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-white rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                          <Image
                            src="/images/wechat-pay.png"
                            alt="微信支付二维码"
                            width={192}
                            height={192}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="font-medium flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          微信支付
                        </p>
                      </div>
                      
                      {/* 支付宝 */}
                      <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-white rounded-xl overflow-hidden border border-slate-200 mb-3 flex items-center justify-center">
                          <Image
                            src="/images/alipay.jpg"
                            alt="支付宝二维码"
                            width={192}
                            height={192}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="font-medium flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.422 15.358c-3.273-1.204-6.174-2.46-7.715-3.35.363-.68.672-1.413.91-2.193H9.637V8.622h5.486V7.55H9.637V5.463H7.528c-.307 0-.554.247-.554.554v1.534H1.9v1.07h5.074v1.193H2.852v1.067h8.108c-.192.54-.42 1.056-.684 1.534-2.046-.732-4.258-1.182-6.39-1.182-2.886 0-4.816 1.127-4.816 3.033 0 1.854 1.85 3.003 4.622 3.003 2.303 0 4.23-.892 5.713-2.436 2.037 1.092 5.39 2.416 9.25 3.685L21.422 15.358zM4.076 16.37c-1.715 0-2.673-.61-2.673-1.554 0-.982.997-1.58 2.673-1.58 1.707 0 3.54.41 5.207 1.112C8.095 15.623 6.24 16.37 4.076 16.37z"/>
                          </svg>
                          支付宝
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg text-center">
                      <p className="text-sm text-pink-700 dark:text-pink-400">
                        支付完成后，系统将自动记录您的支持。<br/>
                        如有问题，请通过页面底部的联系方式与我们取得联系。
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 用户意见信箱 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    用户意见信箱
                  </CardTitle>
                  <CardDescription>
                    您的意见对我们很重要，欢迎提出宝贵建议
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 提交表单 */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        placeholder="您的称呼（选填）"
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        className="flex-shrink-0 w-32"
                      />
                      <Textarea
                        placeholder="请输入您的意见或建议..."
                        value={feedbackContent}
                        onChange={(e) => setFeedbackContent(e.target.value)}
                        className="flex-1 min-h-[80px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      {feedbackError && (
                        <p className="text-sm text-red-500">{feedbackError}</p>
                      )}
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting}
                        className="ml-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            提交中...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            提交意见
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 反馈列表 */}
                  {feedbacks.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-slate-500 mb-3">
                        最近 {feedbacks.length} 条意见
                      </p>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {feedbacks.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{feedback.name}</span>
                              <span className="text-xs text-slate-500">{formatTime(feedback.createdAt)}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {feedback.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 右侧：说明信息 */}
            <div className="space-y-6">
              {/* 资金用途 */}
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800">
                <CardHeader>
                  <CardTitle className="text-lg">资金用途</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">功能迭代</p>
                      <p className="text-xs text-slate-500">开发更多实用工具</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">团队运营</p>
                      <p className="text-xs text-slate-500">保障服务稳定运行</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">用户服务</p>
                      <p className="text-xs text-slate-500">提供更好的支持</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 捐赠须知 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">捐赠须知</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>您的捐赠将用于项目开发和运营</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>所有捐赠记录将公开透明</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>捐赠后可获得特别感谢</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>支持开具捐赠收据</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 联系我们 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">联系我们</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>如有任何问题或建议，欢迎联系我们：</p>
                  <p className="text-pink-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    lseldouglas@gmail.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            感谢每一位支持者，您的支持就是我们进步最大的动力
          </p>
        </div>
      </footer>
    </div>
  );
}
