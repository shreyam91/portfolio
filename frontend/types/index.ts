

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pomodoro {
  _id: string;
  userId: string;
  type: 'work' | 'short_break' | 'long_break';
  duration: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export interface DSAQuestion {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  problemStatement?: string;
  description?: string;
  companies?: string[];
  status: 'solved' | 'unsolved';
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
