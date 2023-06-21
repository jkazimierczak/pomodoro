import { z } from "zod";

export const settingsSchema = z.object({
  sessionDuration: z.coerce.number().min(1).max(120),
  breakDuration: z.coerce.number().min(1).max(60),
  longBreakDuration: z.coerce.number().min(1).max(60),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(10),
  dailyGoal: z.coerce.number().min(1).max(16),
  canPlaySound: z.boolean(),
  autoStartBreaks: z.boolean(),
  autoStartSessions: z.boolean(),
  startNewDayAt: z.string(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
