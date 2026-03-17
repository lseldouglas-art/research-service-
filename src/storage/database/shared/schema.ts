import { pgTable, serial, timestamp, varchar, text, boolean, integer, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  openid: varchar("openid", { length: 128 }).unique(),
  unionid: varchar("unionid", { length: 128 }).unique(),
  provider: varchar("provider", { length: 20 }).notNull(), // 'wechat' | 'qq'
  nickname: varchar("nickname", { length: 128 }),
  avatar: varchar("avatar", { length: 512 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// 用户会话表
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 用户活动记录表
export const userActivities = pgTable("user_activities", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(), // 'literature_split' | 'batch_analysis' | 'cluster_outline' | 'paragraph_write'
  toolName: varchar("tool_name", { length: 100 }).notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // 存储额外信息，如文件名、批次数量等
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// TypeScript 类型
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
