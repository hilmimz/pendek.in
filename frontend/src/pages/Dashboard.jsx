import { useState } from "react";
import { CreateLinkCard } from "../components/create-link-card";
import { StatsCard } from "../components/ui/stats-card";
import { RecentLinks } from "../components/ui/recent-urls";
import { Link2, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";
import { getStats } from "../services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const stats = await getStats();
        setStatsData(stats.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const calcChange = (current, previous) => {
    if (!previous) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const totalUrl = statsData?.url_stats?.total_url ?? 0
  const totalClick = statsData?.click_stats?.total_click ?? 0
  const urlThisMonth = statsData?.url_stats?.url_this_month ?? 0
  const urlLastMonth = statsData?.url_stats?.url_last_month ?? 0
  const clickThisMonth = statsData?.click_stats?.click_this_month ?? 0
  const clickLastMonth = statsData?.click_stats?.click_last_month ?? 0
  const clickToday = statsData?.click_stats?.click_today ?? 0
  const clickYesterday = statsData?.click_stats?.click_yesterday ?? 0

  const avgClick = totalUrl > 0 ? (totalClick / totalUrl).toFixed(1) : 0
  const avgClickThisMonth = urlThisMonth > 0 ? clickThisMonth / urlThisMonth : 0
  const avgClickLastMonth = urlLastMonth > 0 ? clickLastMonth / urlLastMonth : 0

  const totalUrlChange = urlThisMonth - urlLastMonth
  const totalClickChange = clickThisMonth - clickLastMonth
  const avgClickChange = Number((avgClickThisMonth - avgClickLastMonth).toFixed(2))
  const clickTodayChange = clickToday - clickYesterday

  const getTrend = (val) => val > 0 ? "up" : val < 0 ? "down" : "neutral"
  const totalUrlTrend = getTrend(totalUrlChange)
  const totalClickTrend = getTrend(totalClickChange)
  const avgClickTrend = getTrend(avgClickChange)
  const clickTodayTrend = getTrend(clickTodayChange)

  const formatChange = (val, suffix = "from last month") => {
    const num = Number(val)
    const abs = Math.abs(num)
    if (num === 0) return `no change ${suffix}`
    return `${abs} ${suffix}`
  }

  return (
    <div className="font-sans flex flex-col gap-10">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground">Failed to fetch data</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Urls"
            value={totalUrl}
            change={formatChange(totalUrlChange)}
            trend={totalUrlTrend}
            icon={Link2}
            iconColor="bg-primary"
          />
          <StatsCard
            title="Total Clicks"
            value={totalClick}
            change={formatChange(totalClickChange)}
            trend={totalClickTrend}
            icon={MousePointerClick}
            iconColor="bg-secondary"
          />
          <StatsCard
            title="Avg Click / URL"
            value={avgClick}
            change={formatChange(avgClickChange)}
            trend={avgClickTrend}
            icon={TrendingUp}
            iconColor="bg-[#a64d79]"
          />
          <StatsCard
            title="Click Today"
            value={clickToday}
            change={formatChange(clickTodayChange, "from yesterday")}
            trend={clickTodayTrend}
            icon={Users}
            iconColor="bg-[#8b1c4a]"
          />
        </div>
      )}
      <CreateLinkCard />
      <RecentLinks />
    </div>
  );
}
