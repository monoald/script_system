'use client';

import { useState } from "react";
import KPICards from "@/components/dashboard/KPICards";
import InfluencerTable from "@/components/dashboard/InfluencerTable";
import ScriptTable from "@/components/dashboard/ScriptTable";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Platform } from "@/types";
import { cn } from "@/lib/utils";
import { subDays, format } from "date-fns";

export default function Dashboard() {
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { influencers, scripts, kpi, allKPIs, isLoading } = useDashboardData(platform, dateRange);

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Overview of your influencer marketing performance.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Platform Toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 backdrop-blur-md">
            {(['all', 'tiktok', 'youtube'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize",
                  platform === p
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <DatePickerWithRange 
            date={dateRange}
            setDate={(range) => {
              if (range?.from) {
                setDateRange(range);
              }
            }}
          />
        </div>
      </div>

      {(isLoading || !kpi || !allKPIs) ? (
        <div className="flex h-96 items-center justify-center">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-cyan-400 rounded-full mr-3 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              Performance Overview
            </h2>
            <KPICards data={kpi} />
          </section>

          {/* AI Smart Insights */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-yellow-400 rounded-full mr-3 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
              AI Insights & Analysis
            </h2>
            <SmartInsights influencers={influencers} kpi={allKPIs} />
          </section>

          {/* Two Column Layout for Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Influencer Leaderboard */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-1 h-6 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                  Top Influencers
                </h2>
              </div>
              <InfluencerTable data={influencers ?? []} />
            </section>

            {/* Top Performing Scripts */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-pink-500 rounded-full mr-3 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
                Top Scripts
              </h2>
              <ScriptTable data={scripts ?? []} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
