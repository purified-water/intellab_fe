import { useState, useEffect } from "react";
import { PodiumItem, LeaderboardList } from "../components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TRank } from "../types";

const SAMPLE_DATA: TRank[] = [
  {
    rank: 1,
    points: 1000,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "1",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },

  {
    rank: 2,
    points: 900,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "2",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },

  {
    rank: 3,
    points: 800,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "3",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 4,
    points: 700,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "4",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 5,
    points: 600,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "5",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 6,
    points: 500,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "6",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 7,
    points: 400,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "7",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 8,
    points: 300,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "8",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  },
  {
    rank: 9,
    points: 200,
    user: {
      displayName: "Username",
      firstName: "First name",
      lastName: "Last name",
      email: "",
      role: "user",
      userId: "9",
      phoneNumber: "",
      photoUrl: "",
      emailVerified: false,
      lastSignIn: "",
      disabled: false
    }
  }
];

export function LeaderboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    document.title = "Leaderboard | Intellab";
  }, []);

  const onLeaderboardClick = () => {
    navigate("/");
  };

  const renderTitle = () => {
    return (
      <div className="flex items-center mb-6 cursor-pointer" onClick={onLeaderboardClick}>
        <ChevronLeft className="w-6 h-6 mr-2 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
      </div>
    );
  };

  const rendrerPodiums = () => {
    return (
      <div className="flex items-end justify-center space-x-7">
        <PodiumItem item={SAMPLE_DATA[1]} height={110} loading={loading} />
        <PodiumItem item={SAMPLE_DATA[0]} color="gold" height={130} loading={loading} />
        <PodiumItem item={SAMPLE_DATA[2]} color="bronze" loading={loading} />
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto ">
        {renderTitle()}
        <div className="space-y-8 justify-items-center">
          {rendrerPodiums()}
          <LeaderboardList data={SAMPLE_DATA} />
        </div>
      </div>
    </div>
  );
}
