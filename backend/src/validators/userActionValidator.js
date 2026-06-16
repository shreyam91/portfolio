const { z } = require('zod');

const pomodoroSchema = z.object({
  body: z.object({
    duration: z.number().int().min(1).max(360),
    type: z.enum(['work', 'short_break', 'long_break']),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional()
  })
});

const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional()
  })
});

const submissionSchema = z.object({
  body: z.object({
    problemId: z.string().min(1),
    category: z.enum(['DSA', 'SystemDesign', 'MachineCoding', 'PlacementPrep']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'])
  })
});

const notificationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.string().optional(),
    link: z.string().optional(),
    read: z.boolean().optional()
  })
});

module.exports = {
  pomodoroSchema,
  taskSchema,
  submissionSchema,
  notificationSchema
};
