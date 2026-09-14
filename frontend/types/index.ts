export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pomodoro {
  _id: string;
  userId: string;
  type: "work" | "short_break" | "long_break";
  duration: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export interface DSASubmission {
  code?: string;
  language?: string;
  submissionId?: string;
  status?: number | string;
  viewMode?: string;
  runtime?: string | number;
  testCases?: unknown;
  submittedAt?: string;
  githubPath?: string;
}

export interface DSAQuestion {
  _id: string;
  // Source identification (from DSAForge metadata)
  platform: "leetcode" | "gfg";
  pid: string;
  slug: string;
  title: string;
  problemUrl?: string;
  // Problem details
  difficulty?: "Easy" | "Medium" | "Hard";
  description?: string; // LC: HTML, GFG: plain text statement
  examples?: { input?: string; output?: string; explanation?: string }[];
  inputFormat?: unknown;
  constraints?: unknown;
  expectedTimeComplexity?: string;
  expectedAuxiliarySpace?: string;
  // Tags
  topics: string[];
  companies?: string[];
  // Submission
  submission?: DSASubmission;
  status?: string;
  createdAt: string;
}

// Reusable Paginated Response Type
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
