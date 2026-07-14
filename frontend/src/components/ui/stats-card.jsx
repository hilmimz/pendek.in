import { Card, CardContent } from "./card";

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = "bg-primary",
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-semibold mt-2">{value}</h3>
            <p
              className={`text-sm mt-2 ${trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "--"} {change}
            </p>
          </div>
          <div
            className={`size-14 rounded-lg ${iconColor} flex items-center justify-center`}
          >
            <Icon className="size-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
