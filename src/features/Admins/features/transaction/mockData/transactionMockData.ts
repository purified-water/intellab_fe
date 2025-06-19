// Mock data for transaction components
export const mockPurchasedItems = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    amount: "7,475,000 VND",
    date: "2024-06-10",
    type: "Free" as const
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    amount: "3,725,000 VND",
    date: "2024-06-09",
    type: "Plan" as const
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    amount: "4,975,000 VND",
    date: "2024-06-08",
    type: "Free" as const
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    amount: "2,475,000 VND",
    date: "2024-06-07",
    type: "Plan" as const
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    amount: "9,975,000 VND",
    date: "2024-06-06",
    type: "Free" as const
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    amount: "6,225,000 VND",
    date: "2024-06-05",
    type: "Free" as const
  },
  {
    name: "Chris Miller",
    email: "chris.miller@example.com",
    amount: "4,475,000 VND",
    date: "2024-06-04",
    type: "Plan" as const
  },
  {
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    amount: "8,225,000 VND",
    date: "2024-06-03",
    type: "Free" as const
  },
  {
    name: "Tom Anderson",
    email: "tom.anderson@example.com",
    amount: "3,225,000 VND",
    date: "2024-06-02",
    type: "Plan" as const
  },
  {
    name: "Anna Taylor",
    email: "anna.taylor@example.com",
    amount: "7,225,000 VND",
    date: "2024-06-01",
    type: "Free" as const
  },
  {
    name: "Robert Clark",
    email: "robert.clark@example.com",
    amount: "4,975,000 VND",
    date: "2024-05-31",
    type: "Plan" as const
  },
  {
    name: "Maria Rodriguez",
    email: "maria.rodriguez@example.com",
    amount: "8,725,000 VND",
    date: "2024-05-30",
    type: "Free" as const
  },
  {
    name: "Kevin Lee",
    email: "kevin.lee@example.com",
    amount: "3,975,000 VND",
    date: "2024-05-29",
    type: "Plan" as const
  },
  {
    name: "Jennifer White",
    email: "jennifer.white@example.com",
    amount: "6,975,000 VND",
    date: "2024-05-28",
    type: "Free" as const
  },
  {
    name: "Mark Thompson",
    email: "mark.thompson@example.com",
    amount: "2,975,000 VND",
    date: "2024-05-27",
    type: "Plan" as const
  }
];

export const mockTransactions = [
  {
    id: "tx-001",
    name: "Alice Cooper",
    email: "alice.cooper@example.com",
    amount: "11,475,000 VND",
    date: "2024-06-14",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-002",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    amount: "7,475,000 VND",
    date: "2024-06-13",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-003",
    name: "Carol Johnson",
    email: "carol.johnson@example.com",
    amount: "4,975,000 VND",
    date: "2024-06-12",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-004",
    name: "Daniel Smith",
    email: "daniel.smith@example.com",
    amount: "3,725,000 VND",
    date: "2024-06-11",
    status: "Failed",
    type: "Problem" as const
  },
  {
    id: "tx-005",
    name: "Eva Martinez",
    email: "eva.martinez@example.com",
    amount: "9,475,000 VND",
    date: "2024-06-10",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-006",
    name: "Frank Davis",
    email: "frank.davis@example.com",
    amount: "5,725,000 VND",
    date: "2024-06-09",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-007",
    name: "Grace Brown",
    email: "grace.brown@example.com",
    amount: "8,225,000 VND",
    date: "2024-06-08",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-008",
    name: "Henry Wilson",
    email: "henry.wilson@example.com",
    amount: "4,725,000 VND",
    date: "2024-06-07",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-009",
    name: "Ivy Garcia",
    email: "ivy.garcia@example.com",
    amount: "10,475,000 VND",
    date: "2024-06-06",
    status: "Failed",
    type: "Problem" as const
  },
  {
    id: "tx-010",
    name: "Jack Taylor",
    email: "jack.taylor@example.com",
    amount: "6,475,000 VND",
    date: "2024-06-05",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-011",
    name: "Kate Anderson",
    email: "kate.anderson@example.com",
    amount: "8,975,000 VND",
    date: "2024-06-04",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-012",
    name: "Leo Clark",
    email: "leo.clark@example.com",
    amount: "4,475,000 VND",
    date: "2024-06-03",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-013",
    name: "Mia Rodriguez",
    email: "mia.rodriguez@example.com",
    amount: "7,475,000 VND",
    date: "2024-06-02",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-014",
    name: "Noah Lee",
    email: "noah.lee@example.com",
    amount: "3,475,000 VND",
    date: "2024-06-01",
    status: "Failed",
    type: "Problem" as const
  },
  {
    id: "tx-015",
    name: "Olivia White",
    email: "olivia.white@example.com",
    amount: "9,725,000 VND",
    date: "2024-05-31",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-016",
    name: "Peter Thompson",
    email: "peter.thompson@example.com",
    amount: "5,475,000 VND",
    date: "2024-05-30",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-017",
    name: "Quinn Miller",
    email: "quinn.miller@example.com",
    amount: "8,725,000 VND",
    date: "2024-05-29",
    status: "Success",
    type: "Course" as const
  },
  {
    id: "tx-018",
    name: "Ruby Davis",
    email: "ruby.davis@example.com",
    amount: "4,225,000 VND",
    date: "2024-05-28",
    status: "Success",
    type: "Plan" as const
  },
  {
    id: "tx-019",
    name: "Sam Johnson",
    email: "sam.johnson@example.com",
    amount: "10,725,000 VND",
    date: "2024-05-27",
    status: "Failed",
    type: "Problem" as const
  },
  {
    id: "tx-020",
    name: "Tina Wilson",
    email: "tina.wilson@example.com",
    amount: "4,975,000 VND",
    date: "2024-05-26",
    status: "Success",
    type: "Plan" as const
  }
];

// Configuration for mock mode
export const MOCK_CONFIG = {
  USE_MOCK_DATA: false, // Set to false to use real API calls
  MOCK_DELAY: 1000 // Simulate API delay in milliseconds
};

// Helper function to simulate API delay
export const simulateDelay = (delay: number = MOCK_CONFIG.MOCK_DELAY) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
