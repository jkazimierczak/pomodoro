import { z } from "zod";

export const settingsSchema = z.object({
  sessionDuration: z.coerce.number().min(1).max(120),
  breakDuration: z.coerce.number().min(5).max(60),
  longBreakDuration: z.coerce.number().min(1).max(60),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(10),
  dailyGoal: z.coerce.number().min(1).max(16),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsFormData = {
  sessionDuration: 25,
  breakDuration: 5,
  longBreakDuration: 20,
  sessionsBeforeLongBreak: 4,
  dailyGoal: 8,
};
