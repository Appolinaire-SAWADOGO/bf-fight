import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    matchNumber: v.number(),
    winNumber: v.number(),
    loseNumber: v.number(),
    imageSrc: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_winNumber", ["winNumber"]),
  historical: defineTable({
    userId: v.string(),
    win: v.boolean(),
    opponentId: v.string(),
    opponentName: v.string(),
    opponentImgSrc: v.string(),
  }),
  waitingRoom: defineTable({
    userId: v.string(),
  }).index("by_user_id", ["userId"]),
  match: defineTable({
    user1Id: v.string(),
    user2Id: v.string(),
    user1Ready: v.boolean(),
    user2Ready: v.boolean(),
    user1Character: v.string(),
    user2Character: v.string(),
    user1SocketID: v.string(),
    user2SocketID: v.string(),
  }).index("by_user_id", ["user1Id", "user2Id"]),
});
