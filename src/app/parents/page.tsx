import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Eye, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ParentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      {/* 头部 */}
      <header className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">👨‍👩‍👧‍👦</div>
            <h1 className="text-2xl font-bold text-gray-800">
              家长指南
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 介绍 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            为孩子打造的安全AI创作空间 ✨
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们致力于为3-8岁儿童提供安全、有趣、富有教育意义的AI画画体验。
            以下是我们的安全承诺和使用建议。
          </p>
        </div>

        {/* 安全特性 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Shield className="w-6 h-6 mr-2" />
                内容安全
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• 智能内容过滤，拦截不适宜内容</p>
              <p>• 所有生成图片经过安全检测</p>
              <p>• 关键词黑名单保护</p>
              <p>• 儿童友好的图片风格优化</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Lock className="w-6 h-6 mr-2" />
                隐私保护
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• 不存储孩子的语音数据</p>
              <p>• 图片生成后自动删除</p>
              <p>• 不收集个人信息</p>
              <p>• 符合儿童隐私保护法规</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Heart className="w-6 h-6 mr-2" />
                教育价值
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• 激发想象力和创造力</p>
              <p>• 提升语言表达能力</p>
              <p>• 培养艺术审美</p>
              <p>• 增强科技认知</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Eye className="w-6 h-6 mr-2" />
                家长监督
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• 建议家长陪同使用</p>
              <p>• 可随时查看生成内容</p>
              <p>• 引导孩子健康表达</p>
              <p>• 共同探索创意可能</p>
            </CardContent>
          </Card>
        </div>

        {/* 使用建议 */}
        <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              💡 使用建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">适合年龄：3-8岁</h4>
              <p className="text-gray-600">
                建议在家长陪同下使用，帮助孩子更好地表达想法。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">使用时长：每次15-30分钟</h4>
              <p className="text-gray-600">
                适度使用，避免长时间接触屏幕。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">创意引导：</h4>
              <p className="text-gray-600">
                鼓励孩子描述颜色、形状、动作，丰富画面细节。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">
              📞 联系我们
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>问题反馈：</strong> feedback@kidsai.com
            </p>
            <p>
              <strong>安全举报：</strong> safety@kidsai.com
            </p>
            <p>
              <strong>技术支持：</strong> support@kidsai.com
            </p>
            <p className="text-sm text-gray-600 mt-4">
              我们会在24小时内回复您的问题。孩子的安全和快乐是我们的首要考虑。
            </p>
          </CardContent>
        </Card>

        {/* 返回按钮 */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3">
              开始创作之旅 🎨
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
