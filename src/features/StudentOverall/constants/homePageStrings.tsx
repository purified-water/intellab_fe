import { BookOpen, Code, MessageCircleCode, Sparkle, TextCursorInput, Trophy } from "lucide-react";

export const HOME_PAGE = {
  HERO: {
    TITLE: "Master Coding Skills at Your Own Pace",
    DESCRIPTION:
      "Interactive lessons, challenging problems and personalized learning paths to help you become a confident developer.",
    REGISTER: "Sign up for free"
  },
  FEATURES: {
    TITLE: "Why Choose Intellab?",
    DESCRIPTION: "Our platform is designed to make learning to code effective, engaging, and tailored to your needs."
  },
  COURSES: {
    FEATURED_TITLE: "Featured Courses",
    FEATURED_DESCRIPTION: "Discover our most popular courses and start your coding journey today.",
    FREE_TITLE: "Free Courses",
    FREE_DESCRIPTION: "Explore our selection of free courses to kickstart your coding journey."
  },
  PRICING: {
    TITLE: "Explore Intellab Premium",
    DESCRIPTION: "Unlock full access all features with Intellab Premium."
  },
  USER_WELCOME: {
    TITLE: "Welcome back, "
  },
  YOUR_COURSES: {
    TITLE: "Your Courses",
    DESCRIPTION: "Continue learning with your personalized course recommendations."
  }
};

export const featureSectionItems = [
  {
    icon: <Code className="size-5" />,
    title: "Interactive Coding",
    description: "Practice coding directly in your browser with real-time results and feedback."
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "Structured Lessons",
    description: "Study structured lessons and quizzes to broaden your knowledge."
  },
  {
    icon: <Trophy className="size-5" />,
    title: "Achievement System",
    description: "Earn badges and certificates as you progress through your learning journey."
  },
  {
    icon: <MessageCircleCode className="size-5" />,
    title: "Problem AI Assistant",
    description: "Improve your coding skills with the help of Built-in AI Chatbot."
  },
  {
    icon: <Sparkle className="size-5" />,
    title: "Customized Learning Path",
    description: "Personalize your learning path to best match your needs with Intellab AI."
  },
  {
    icon: <TextCursorInput className="size-5" />,
    title: "Lesson AI Assistant",
    description: "Real-time AI assistance while you learn, making complex concepts easier to grasp."
  }
];

export const pricingPlans = [
  {
    name: "Free",
    description: "Basic plan for everyone",
    price: "",
    buttonText: "Get Started",
    featured: false,
    features: ["Access to free courses", "Access to public problems", "Limited AI usage"]
  },
  {
    name: "Premium",
    description: "Premium access to everything",
    price: "299,000 VND",
    buttonText: "Explore Plan",
    featured: true,
    features: [
      "Access to all courses",
      "Access to all problems",
      "Unlimited Problem AI Assistant",
      "Unlimited Course AI Assistant",
      "Access to advanced AI models"
    ]
  }
];
