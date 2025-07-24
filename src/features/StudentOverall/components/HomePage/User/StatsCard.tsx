import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn";
import { Skeleton } from "@/components/ui/shadcn";
import { userAPI } from "@/lib/api";
import { RootState } from "@/redux/rootReducer";
import { setPoint, setUserCourseCount } from "@/redux/user/userSlice";
import { showToastError } from "@/utils";
import { Flame, Award, BookOpen } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/hooks";

interface StatsCardsProps {
  loginStreak: number | null;
  isLoadingLoginStreak: boolean;
}

export const StatsCards = ({ loginStreak, isLoadingLoginStreak }: StatsCardsProps) => {
  const userCompletedCourseCount = useSelector((state: RootState) => state.user.user?.courseCount);
  const userPoint = useSelector((state: RootState) => state.user.point);
  const dispatch = useDispatch();
  const toast = useToast();

  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingPoint, setIsLoadingPoint] = useState(true);

  const getMyCompletedCourseCountAPI = async () => {
    await userAPI.getMyCompletedCourseCount({
      onSuccess: async (count) => {
        dispatch(setUserCourseCount(count));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message }),
      onEnd: async () => setIsLoadingCourse(false)
    });
  };

  const getMyPointAPI = async () => {
    await userAPI.getMyPoint({
      onSuccess: async (point) => {
        dispatch(setPoint(point));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message }),
      onEnd: async () => setIsLoadingPoint(false)
    });
  };

  useEffect(() => {
    getMyCompletedCourseCountAPI();
    getMyPointAPI();
  }, []);

  const statItems = [
    {
      title: "Login Streak",
      icon: <Flame className="w-4 h-4 text-bronze" />,
      value: loginStreak ?? 0,
      suffix: "Days",
      border: "border-l-bronze",
      isLoading: isLoadingLoginStreak
    },
    {
      title: "Your Points",
      icon: <Award className="w-4 h-4 text-gold" />,
      value: userPoint ?? 0,
      suffix: "Points",
      border: "border-l-gold",
      isLoading: isLoadingPoint
    },
    {
      title: "Your Completed Courses",
      icon: <BookOpen className="w-4 h-4 text-appPrimary" />,
      value: userCompletedCourseCount ?? 0,
      suffix: "Courses",
      border: "border-l-appPrimary",
      isLoading: isLoadingCourse
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
