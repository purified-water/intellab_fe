// Mock data for user growth development/testing
export const userGrowthMockData = {
  daily: {
    code: 200,
    result: {
      type: "daily",
      data: [
        { label: "Mon", value: 10 },
        { label: "Tue", value: 15 },
        { label: "Wed", value: 20 },
        { label: "Thu", value: 25 },
        { label: "Fri", value: 30 },
        { label: "Sat", value: 35 },
        { label: "Sun", value: 40 }
      ]
    }
  },
  weekly: {
    code: 200,
    result: {
      type: "weekly",
      data: [
        { label: "Week 1", value: 30 },
        { label: "Week 2", value: 40 },
        { label: "Week 3", value: 50 },
        { label: "Week 4", value: 60 }
      ]
    }
  },
  monthly: {
    code: 200,
    result: {
      type: "monthly",
      data: [
        { label: "Jan", value: 50 },
        { label: "Feb", value: 60 },
        { label: "Mar", value: 70 },
        { label: "Apr", value: 90 },
        { label: "May", value: 100 },
        { label: "Jun", value: 120 },
        { label: "Jul", value: 140 },
        { label: "Aug", value: 160 },
        { label: "Sep", value: 180 },
        { label: "Oct", value: 200 },
        { label: "Nov", value: 220 },
        { label: "Dec", value: 240 }
      ]
    }
  },
  custom: {
    code: 200,
    result: {
      type: "custom",
      data: [
        { label: "Apr 1", value: 50 },
        { label: "Apr 8", value: 60 },
        { label: "Apr 15", value: 70 },
        { label: "Apr 22", value: 80 },
        { label: "Apr 29", value: 90 },
        { label: "May 6", value: 100 }
      ]
    }
  }
};
