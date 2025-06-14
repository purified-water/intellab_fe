import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn";
import { Skeleton } from "@/components/ui/shadcn";
import { LoginStreak } from "@/features/StudentOverall/types";
import { NA_VALUE } from "@/constants";
import { RootState } from "@/redux/rootReducer";
import { Flame, Award, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";

interface StatsCardsProps {
  loginStreak: LoginStreak | null;
  isLoadingLoginStreak?: boolean;
}

export const StatsCards = ({ loginStreak, isLoadingLoginStreak }: StatsCardsProps) => {
  const userRedux = useSelector((state: RootState) => state.user.user);
  const isUserLoading = !userRedux;
  const isLoginStreakLoading = isLoadingLoginStreak || !loginStreak;
  const userPoint = useSelector((state: RootState) => state.user.point);

  const statItems = [
    {
      title: "Login Streak",
      icon: <Flame className="w-4 h-4 text-bronze" />,
      value: loginStreak?.streakLogin ?? 0,
      suffix: "Days",
      border: "border-l-bronze",
      isLoading: isLoginStreakLoading
    },
    {
      title: "Your Points",
      icon: <Award className="w-4 h-4 text-gold" />,
      value: userPoint ?? NA_VALUE,
      suffix: "Points",
      border: "border-l-gold",
      isLoading: isUserLoading
    },
    {
      title: "Your Courses",
      icon: <BookOpen className="w-4 h-4 text-appPrimary" />,
      value: userRedux?.courseCount ?? 0,
      suffix: "Courses",
      border: "border-l-appPrimary",
      isLoading: isUserLoading
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statItems.map((item, index) => (
        <Card key={index} className={`border-l-4 ${item.border}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            {item.isLoading ? (
              <>
                <Skeleton className="w-16 h-6 mb-1" />
                <Skeleton className="w-10 h-4" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.suffix}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
