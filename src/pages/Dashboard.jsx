import { CreateLinkCard } from "../components/create-link-card";
import { StatsCard } from "../components/ui/stats-card";
import { Link2, MousePointerClick, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Links"
          value="247"
          change="12% from last month"
          trend="up"
          icon={Link2}
          iconColor="bg-primary"
        />
        <StatsCard
          title="Total Clicks"
          value="8,547"
          change="23% from last month"
          trend="up"
          icon={MousePointerClick}
          iconColor="bg-secondary"
        />
        <StatsCard
          title="Click Rate"
          value="34.6%"
          change="8% from last month"
          trend="up"
          icon={TrendingUp}
          iconColor="bg-[#a64d79]"
        />
        <StatsCard
          title="Active Users"
          value="1,234"
          change="3% from last month"
          trend="down"
          icon={Users}
          iconColor="bg-[#8b1c4a]"
        />
      </div>
      <CreateLinkCard />
    </div>
  );
}
