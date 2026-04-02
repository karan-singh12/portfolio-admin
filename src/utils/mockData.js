// Mock helper (used when APP_FLAGS.ENABLE_MOCK_API is true)

// Helper function to simulate API delay
export const mockDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
