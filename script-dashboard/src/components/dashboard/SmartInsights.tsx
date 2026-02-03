import { Influencer, KPI } from "@/types";
import { TrendingUp, TrendingDown, AlertTriangle, Zap, Target, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartInsightsProps {
  influencers: Influencer[];
  kpi: Record<'all' | 'tiktok' | 'youtube', KPI>;
}

export default function SmartInsights({ influencers, kpi }: SmartInsightsProps) {
  // Calculations
  const totalRevenue = kpi.all.revenue || 1; // Avoid division by zero
  const tiktokShare = (kpi.tiktok.revenue / totalRevenue) * 100;
  const youtubeShare = (kpi.youtube.revenue / totalRevenue) * 100;

  const topInfluencer = [...influencers].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const topInfluencerShare = topInfluencer ? (topInfluencer.totalRevenue / totalRevenue) * 100 : 0;

  // Generate Insights
  const insights = [];

  // 1. Trend Analysis
  influencers.forEach(inf => {
    if (inf.trend === 'down') {
       insights.push({
         type: 'warning',
         icon: TrendingDown,
         color: 'text-red-400',
         bg: 'bg-red-500/10',
         border: 'border-red-500/20',
         title: 'Performance Drop',
         message: `${inf.name} started well but sales are trending down.`
       });
    }
  });

  // 2. Product Concentration
  influencers.forEach(inf => {
    if (inf.productBreakdown && inf.productBreakdown.length > 0) {
      const topProduct = [...inf.productBreakdown].sort((a, b) => b.revenue - a.revenue)[0];
      const share = (topProduct.revenue / inf.totalRevenue);
      
      // Only show if highly concentrated (>80%)
      if (share > 0.80) {
        insights.push({
          type: 'opportunity',
          icon: Target,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          title: 'Focus Opportunity',
          message: `${(share * 100).toFixed(0)}% of ${inf.name}'s sales are "${topProduct.name}". Focus solely on this product.`
        });
      }
    }
  });

  // Limit to 4 insights to avoid clutter
  const displayInsights = insights.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Platform Distribution */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <PieChart className="w-24 h-24 text-purple-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-5 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
          Platform Split
        </h3>
        
        <div className="space-y-6">
          {/* YouTube */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300 flex items-center"><Zap className="w-3 h-3 mr-1 text-red-500"/> YouTube</span>
              <span className="font-bold text-white">{youtubeShare.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
                style={{ width: `${youtubeShare}%` }}
              />
            </div>
          </div>

          {/* TikTok */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300 flex items-center"><Zap className="w-3 h-3 mr-1 text-cyan-500"/> TikTok</span>
              <span className="font-bold text-white">{tiktokShare.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                style={{ width: `${tiktokShare}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Influencer Concentration */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-24 h-24 text-pink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-5 bg-pink-500 rounded-full mr-3 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
          Market Leader
        </h3>

        {topInfluencer ? (
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Top Performer</div>
              <div className="text-pink-400 font-bold text-sm bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">
                #{topInfluencerShare.toFixed(1)}% of Total Sales
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">{topInfluencer.name}</div>
            <div className="text-sm text-gray-400 mb-6 capitalize">{topInfluencer.platform} Influencer</div>

            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)] relative overflow-hidden"
                style={{ width: `${topInfluencerShare}%` }}
              >
                 <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This influencer generates significant portion of your total revenue.
            </p>
          </div>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>

      {/* AI Actionable Insights */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="w-1 h-5 bg-cyan-400 rounded-full mr-3 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          AI Recommendations
        </h3>
        
        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {displayInsights.length > 0 ? (
            displayInsights.map((insight, idx) => (
              <div 
                key={idx}
                className={cn(
                  "p-3 rounded-lg border flex items-start space-x-3 transition-all hover:translate-x-1",
                  insight.bg,
                  insight.border
                )}
              >
                <insight.icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", insight.color)} />
                <div>
                  <h4 className={cn("text-sm font-bold mb-0.5", insight.color)}>{insight.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{insight.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm text-center py-4">No critical insights found at this moment.</div>
          )}
        </div>
      </div>
    </div>
  );
}
