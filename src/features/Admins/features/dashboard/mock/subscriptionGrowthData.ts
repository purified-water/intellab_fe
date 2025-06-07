// Mock data for subscription growth development/testing
export const subscriptionGrowthMockData = {
  daily: {
    code: 200,
    result: {
      type: "daily",
      data: [
        { label: "Mon", value: 10 },
        { label: "Tue", value: 15 },
        { label: "Wed", value: 12 },
        { label: "Thu", value: 18 },
        { label: "Fri", value: 20 },
        { label: "Sat", value: 22 },
        { label: "Sun", value: 19 }
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
        { label: "Jan", value: 100 },
        { label: "Feb", value: 130 },
        { label: "Mar", value: 150 },
        { label: "Apr", value: 170 },
        { label: "May", value: 180 },
        { label: "Jun", value: 200 },
        { label: "Jul", value: 220 },
        { label: "Aug", value: 240 },
        { label: "Sep", value: 230 },
        { label: "Oct", value: 260 },
        { label: "Nov", value: 280 },
        { label: "Dec", value: 310 }
      ]
    }
  }
};
