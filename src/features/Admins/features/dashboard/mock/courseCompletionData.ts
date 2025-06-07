// Mock data for course completion rate development/testing
export const courseCompletionMockData = {
  daily: {
    code: 200,
    result: {
      type: "daily",
      data: [
        { label: "Mon", value: 75 },
        { label: "Tue", value: 78 },
        { label: "Wed", value: 80 },
        { label: "Thu", value: 77 },
        { label: "Fri", value: 82 },
        { label: "Sat", value: 85 },
        { label: "Sun", value: 79 }
      ]
    }
  },
  weekly: {
    code: 200,
    result: {
      type: "weekly",
      data: [
        { label: "Week 1", value: 72 },
        { label: "Week 2", value: 75 },
        { label: "Week 3", value: 78 },
        { label: "Week 4", value: 80 }
      ]
    }
  },
  monthly: {
    code: 200,
    result: {
      type: "monthly",
      data: [
        { label: "Jan", value: 70 },
        { label: "Feb", value: 72 },
        { label: "Mar", value: 68 },
        { label: "Apr", value: 75 },
        { label: "May", value: 80 },
        { label: "Jun", value: 78 },
        { label: "Jul", value: 82 },
        { label: "Aug", value: 79 },
        { label: "Sep", value: 85 },
        { label: "Oct", value: 83 },
        { label: "Nov", value: 86 },
        { label: "Dec", value: 88 }
      ]
    }
  },
  custom: {
    code: 200,
    result: {
      type: "custom",
      data: [
        { label: "Apr 1", value: 76 },
        { label: "Apr 8", value: 79 },
        { label: "Apr 15", value: 82 },
        { label: "Apr 22", value: 85 },
        { label: "Apr 29", value: 81 },
        { label: "May 6", value: 84 }
      ]
    }
  }
};
