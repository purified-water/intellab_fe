import { useState } from "react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { QuizResult } from "../components/QuizResult";
import { Button } from "@/components/ui/Button";

const sampleQuizzes = [
  {
    questionId: "1",
    questionContent: "What Kubernetes object adds or deletes pods for scaling and redundancy?",
    correctAnswer: "2",
    options: [
      { order: 1, content: "A Secret" },
      { order: 2, content: "A ReplicaSet" },
      { order: 3, content: "A DaemonSet" },
      { order: 4, content: "A ConfigMap" }
    ],
    feedback: "A ReplicaSet is the correct object for scaling and redundancy."
  },
  {
    questionId: "2",
    questionContent: "What are the autoscaling types in Kubernetes?",
    correctAnswer: "4",
    options: [
      { order: 1, content: "Horizontal, Vertical, Node" },
      { order: 2, content: "Deployment, Node, and Pod" },
      { order: 3, content: "Horizontal and Vertical" },
      { order: 4, content: "Horizontal, Vertical, and Cluster" }
    ],
    feedback: "Cluster Autoscaler (CA) is a third type of autoscaling in Kubernetes."
  },
  {
    questionId: "3",
    questionContent: "What is the default service type in Kubernetes?",
    correctAnswer: "1",
    options: [
      { order: 1, content: "ClusterIP" },
      { order: 2, content: "NodePort" },
      { order: 3, content: "LoadBalancer" },
      { order: 4, content: "ExternalName" }
    ],
    feedback: "ClusterIP is the default service type in Kubernetes."
  },
  {
    questionId: "4",
    questionContent: "Which command is used to create a new namespace in Kubernetes?",
    correctAnswer: "3",
    options: [
      { order: 1, content: "kubectl create ns" },
      { order: 2, content: "kubectl new namespace" },
      { order: 3, content: "kubectl create namespace" },
      { order: 4, content: "kubectl namespace create" }
    ],
    feedback: "The correct command is 'kubectl create namespace'."
  },
  {
    questionId: "5",
    questionContent: "What is the purpose of a ConfigMap in Kubernetes?",
    correctAnswer: "2",
    options: [
      { order: 1, content: "To store sensitive information" },
      { order: 2, content: "To store non-confidential data in key-value pairs" },
      { order: 3, content: "To manage container images" },
      { order: 4, content: "To define network policies" }
    ],
    feedback: "ConfigMap is used to store non-confidential data in key-value pairs."
  },
  {
    questionId: "6",
    questionContent: "Which Kubernetes object is used to run a single instance of a pod indefinitely?",
    correctAnswer: "4",
    options: [
      { order: 1, content: "ReplicaSet" },
      { order: 2, content: "StatefulSet" },
      { order: 3, content: "DaemonSet" },
      { order: 4, content: "Deployment" }
    ],
    feedback: "A Deployment is used to run a single instance of a pod indefinitely."
  },
  {
    questionId: "7",
    questionContent: "What is the purpose of a Kubernetes Ingress?",
    correctAnswer: "3",
    options: [
      { order: 1, content: "To manage storage volumes" },
      { order: 2, content: "To schedule pods on nodes" },
      { order: 3, content: "To expose HTTP and HTTPS routes to services" },
      { order: 4, content: "To define resource limits for containers" }
    ],
    feedback: "Ingress is used to expose HTTP and HTTPS routes to services."
  },
  {
    questionId: "8",
    questionContent: "Which command is used to view the logs of a pod in Kubernetes?",
    correctAnswer: "1",
    options: [
      { order: 1, content: "kubectl logs" },
      { order: 2, content: "kubectl get logs" },
      { order: 3, content: "kubectl describe logs" },
      { order: 4, content: "kubectl show logs" }
    ],
    feedback: "The correct command to view pod logs is 'kubectl logs'."
  },
  {
    questionId: "9",
    questionContent: "What is a StatefulSet in Kubernetes used for?",
    correctAnswer: "2",
    options: [
      { order: 1, content: "To manage stateless applications" },
      { order: 2, content: "To manage stateful applications" },
      { order: 3, content: "To manage batch jobs" },
      { order: 4, content: "To manage network policies" }
    ],
    feedback: "StatefulSet is used to manage stateful applications."
  },
  {
    questionId: "10",
    questionContent: "Which Kubernetes object is used to define a set of network rules?",
    correctAnswer: "4",
    options: [
      { order: 1, content: "Service" },
      { order: 2, content: "Pod" },
      { order: 3, content: "ConfigMap" },
      { order: 4, content: "NetworkPolicy" }
    ],
    feedback: "NetworkPolicy is used to define a set of network rules."
  }
];

export const LessonQuiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(sampleQuizzes.map((quiz) => [quiz.questionId, null]))
  );
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSelection = (questionId: string, order: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: order }));
  };

  const handleSubmit = () => {
    const results: Record<string, boolean> = {};
    sampleQuizzes.forEach((quiz) => {
      results[quiz.questionId] = selectedAnswers[quiz.questionId]?.toString() === quiz.correctAnswer;
    });
    setSubmittedAnswers(results);

    if (Object.values(results).every((result) => result)) {
      setIsSubmitted(true);
    }
  };

  const handleRetry = () => {
    console.log("retry");
  };

  const renderSkeleton = () => {
    return (
      <div className="w-full max-w-3xl p-6">
        {/* Skeleton for each quiz question */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="mb-12">
            {/* Skeleton for question content */}
            <Skeleton className="w-3/4 h-5 mb-3" />
            {/* Skeleton for question options */}
            <ul className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="w-1/2 h-4" />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Skeleton for submit buttons */}
        <div className="flex items-center mt-6 space-x-4">
          <Skeleton className="w-24 h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg w-28" />
        </div>
      </div>
    );
  };

  const renderQuizContent = () => {
    return (
      <>
        {isSubmitted && <QuizResult isCorrect={true} onClick={handleRetry} />}
        <div className="w-full max-w-3xl p-6">
          {/* Questions */}
          <div className="">
            {sampleQuizzes.map((quiz, index) => (
              <div key={quiz.questionId} className="mb-12">
                <p className="mb-3 text-base font-semibold">
                  {index + 1}. {quiz.questionContent}
                </p>
                <ul className="space-y-2">
                  {quiz.options.map((option) => (
                    <li key={option.order} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`quiz-${quiz.questionId}-option-${option.order}`}
                        name={`quiz-${quiz.questionId}`}
                        value={option.order}
                        checked={selectedAnswers[quiz.questionId] === option.order}
                        onChange={() => handleAnswerSelection(quiz.questionId, option.order)}
                        className="w-4 h-4 rounded-full appearance-none cursor-pointer bg-gray5 checked:bg-appPrimary"
                      />
                      <label htmlFor={`quiz-${quiz.questionId}-option-${option.order}`} className="cursor-pointer">
                        {option.content}
                      </label>
                    </li>
                  ))}
                </ul>
                {submittedAnswers[quiz.questionId] !== undefined && (
                  <div
                    className={`my-2 px-4 py-2 rounded-lg text-sm ${
                      submittedAnswers[quiz.questionId] ? "bg-green-50 text-appEasy" : "bg-red-50 text-appHard"
                    }`}
                  >
                    {submittedAnswers[quiz.questionId] ? (
                      "Correct"
                    ) : (
                      <>
                        <span className="font-bold">Incorrect. </span>
                        {quiz.feedback}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center mt-6 space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={Object.values(selectedAnswers).some((answer) => answer === null)}
              className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
            >
              Submit
            </Button>

            <Button className="h-10 bg-white border rounded-lg border-appPrimary text-appPrimary hover:bg-appPrimary hover:text-white">
              Save as draft
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {isLoading ? renderSkeleton() : renderQuizContent()}
    </div>
  );
};
