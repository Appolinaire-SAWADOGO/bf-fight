import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Return  the current user
export const getCurentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .first();

    return user;
  },
});

// Return  the current user
export const getWinAndLoseNumber = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .first();

    if (!user) return null;

    return {
      winNumber: user?.winNumber,
      loseNumber: user?.loseNumber,
    };
  },
});

export const getHistorical = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const historicals = await ctx.db
      .query("historical")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .order("desc")
      .take(3);
    return historicals;
  },
});

// Return the 3 best players
export const getRanks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const ranks = await ctx.db
      .query("users")
      .withIndex("by_winNumber")
      .order("desc")
      .take(3);

    return ranks;
  },
});

// Return current user rank
export const getCurrentUserRank = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const ranks = await ctx.db
      .query("users")
      .withIndex("by_winNumber")
      .order("desc")
      .collect();

    let rank;
    ranks.forEach((user, index) => {
      if (user.userId === identity?.subject) rank = index + 1;
    });

    return rank;
  },
});

// Create a new waiting player
export const enemyData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (existingMatch?.user1Id === identity.subject) {
      const enemyData = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user2Id))
        .order("asc")
        .first();

      return {
        enemyId: enemyData?.userId,
        firstName: enemyData?.firstName,
        lastName: enemyData?.lastName,
        imageUrl: enemyData?.imageSrc,
      };
    } else if (existingMatch?.user2Id === identity.subject) {
      const enemyData = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user1Id))
        .order("asc")
        .first();

      return {
        enemyId: enemyData?.userId,
        firstName: enemyData?.firstName,
        lastName: enemyData?.lastName,
        imageUrl: enemyData?.imageSrc,
      };
    }
  },
});

// Create a new waiting player
export const createMatch = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingPlayer = await ctx.db
      .query("waitingRoom")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (existingPlayer) return null;

    if (!existingMatch)
      await ctx.db.insert("waitingRoom", { userId: identity.subject });

    const existingEnemy = await ctx.db
      .query("waitingRoom")
      .withIndex("by_user_id")
      .filter((q) => q.neq(q.field("userId"), identity.subject))
      .order("asc")
      .first();

    if (!existingEnemy) return null;

    const enemyData = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), existingEnemy.userId))
      .order("asc")
      .first();

    if (!existingMatch) {
      await ctx.db.insert("match", {
        user1Id: identity.subject,
        user2Id: enemyData?.userId as string,
        user1Ready: false,
        user2Ready: false,
        user1Character: "magician",
        user2Character: "magician",
        user1SocketID: "",
        user2SocketID: "",
      });

      const existingPlayer1 = await ctx.db
        .query("waitingRoom")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .first();

      if (existingPlayer1) await ctx.db.delete(existingPlayer1?._id);

      const existingPlayer2 = await ctx.db
        .query("waitingRoom")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), enemyData?.userId))
        .first();

      if (existingPlayer2) await ctx.db.delete(existingPlayer2?._id);
    }
  },
});

// exit in waiting player
export const exitWaitingRoom = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingPlayer = await ctx.db
      .query("waitingRoom")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!existingPlayer) return null;

    await ctx.db.delete(existingPlayer._id);
  },
});

// delete match
export const deleteMatch = mutation({
  args: {
    win: v.optional(v.boolean()),
  },
  handler: async (ctx, { win }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject) {
      // enemy data
      const enemy = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user2Id))
        .first();

      // current user data
      const currentUser = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user1Id))
        .first();

      if (!enemy) return null;
      if (!currentUser) return null;

      // victoire and lose incrementation
      if (win === false) {
        // current user lose increment
        await ctx.db.patch(currentUser?._id as Id<"users">, {
          matchNumber: currentUser?.matchNumber + 1,
          loseNumber: currentUser?.loseNumber + 1,
        });

        // enemy win increment
        await ctx.db.patch(enemy._id as Id<"users">, {
          matchNumber: enemy?.matchNumber + 1,
          winNumber: enemy?.winNumber + 1,
        });
      } else {
        // current user win increment
        await ctx.db.patch(currentUser?._id as Id<"users">, {
          matchNumber: currentUser?.matchNumber + 1,
          winNumber: currentUser?.winNumber + 1,
        });

        // enemy win increment
        await ctx.db.patch(enemy._id as Id<"users">, {
          matchNumber: enemy?.matchNumber + 1,
          loseNumber: enemy?.loseNumber + 1,
        });
      }

      // current user historical
      await ctx.db.insert("historical", {
        userId: identity.subject,
        win: win as boolean,
        opponentId: enemy?.userId as string,
        opponentName: enemy?.firstName as string,
        opponentImgSrc: enemy?.imageSrc as string,
      });

      // enemy historical
      await ctx.db.insert("historical", {
        userId: enemy?.userId as string,
        win: !win as boolean,
        opponentId: identity.subject,
        opponentName: currentUser?.firstName as string,
        opponentImgSrc: currentUser?.imageSrc as string,
      });
    } else if (existingMatch.user2Id === identity.subject) {
      // enemy data
      const enemy = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user1Id))
        .first();

      // current user data
      const currentUser = await ctx.db
        .query("users")
        .withIndex("by_user_id")
        .filter((q) => q.eq(q.field("userId"), existingMatch.user2Id))
        .first();

      if (!enemy) return null;
      if (!currentUser) return null;

      // victoire and lose incrementation
      if (win === false) {
        // current user lose increment
        await ctx.db.patch(currentUser?._id as Id<"users">, {
          matchNumber: currentUser?.matchNumber + 1,
          loseNumber: currentUser?.loseNumber + 1,
        });

        // enemy win increment
        await ctx.db.patch(enemy._id as Id<"users">, {
          matchNumber: enemy?.matchNumber + 1,
          winNumber: enemy?.winNumber + 1,
        });
      } else {
        // current user win increment
        await ctx.db.patch(currentUser?._id as Id<"users">, {
          matchNumber: currentUser?.matchNumber + 1,
          winNumber: currentUser?.winNumber + 1,
        });

        // enemy win increment
        await ctx.db.patch(enemy._id as Id<"users">, {
          matchNumber: enemy?.matchNumber + 1,
          loseNumber: enemy?.loseNumber + 1,
        });
      }

      // current user historical
      await ctx.db.insert("historical", {
        userId: identity.subject,
        win: win as boolean,
        opponentId: enemy?.userId as string,
        opponentName: enemy?.firstName as string,
        opponentImgSrc: enemy?.imageSrc as string,
      });

      // enemy historical
      await ctx.db.insert("historical", {
        userId: enemy?.userId as string,
        win: !win as boolean,
        opponentId: identity.subject,
        opponentName: currentUser?.firstName as string,
        opponentImgSrc: currentUser?.imageSrc as string,
      });
    }
    await ctx.db.delete(existingMatch._id);
  },
});

// player is ready
export const ready = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) throw new Error("existingMatch is missed !");

    if (existingMatch.user1Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user1Ready: true,
      });
    else if (existingMatch.user2Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user2Ready: true,
      });
  },
});

// player is ready
export const cancelReady = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) throw new Error("existingMatch is missed !");

    if (existingMatch.user1Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user1Ready: false,
      });
    else if (existingMatch.user2Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user2Ready: false,
      });
  },
});

// is enemy ready
export const isEnemyReady = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject)
      return existingMatch.user2Ready;
    else if (existingMatch.user2Id === identity.subject)
      return existingMatch.user1Ready;
  },
});

// is player ready
export const isPlayerReady = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject)
      return existingMatch.user1Ready;
    else if (existingMatch.user2Id === identity.subject)
      return existingMatch.user2Ready;
  },
});

// is player ready
export const ifEnemyIsOut = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return true;
    else return false;
  },
});

// is player ready
export const ifEnemyExitMatch = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return true;
    else return false;
  },
});

// select character
export const selectCharacter = mutation({
  args: {
    character: v.string(),
  },
  handler: async (ctx, { character }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user1Character: character,
      });
    else if (existingMatch.user2Id === identity.subject)
      await ctx.db.patch(existingMatch._id, {
        user2Character: character,
      });
  },
});

// select character
export const matchFinish = mutation({
  args: {
    win: v.boolean(),
  },
  handler: async (ctx, { win }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    if (!win) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;
  },
});

// get last match statut
export const getLastMatchStatut = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const historicals = await ctx.db
      .query("historical")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .order("desc")
      .first();

    if (historicals?.win) return "win";
    else return "lose";
  },
});

// get current user character number
export const getCurrentUserCharacterNumber = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject) {
      if (existingMatch.user1Character === "magician") return 1;
      else return 2;
    } else {
      if (existingMatch.user2Character === "magician") return 1;
      else return 2;
    }
  },
});

// get current user number in the currrent match
export const getCurrentUserNumberInMarch = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject) return 1;
    else return 2;
  },
});

// get current user number in the currrent match
export const getCurrentUserName = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .first();

    return user?.firstName;
  },
});

// get MatchID And User MatchId
export const getMatchIDAndUserMatchId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(
          q.eq(q.field("user1Id"), identity.subject),
          q.eq(q.field("user2Id"), identity.subject)
        )
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === identity.subject)
      return {
        userId: existingMatch.user1Id,
        matchId: existingMatch._id,
      };
    else if (existingMatch.user2Id === identity.subject)
      return {
        userId: existingMatch.user2Id,
        matchId: existingMatch._id,
      };
  },
});

// post user socket id
export const postUserSocketId = mutation({
  args: {
    matchId: v.string(),
    userId: v.string(),
    socketId: v.string(),
  },
  handler: async (ctx, { matchId, userId, socketId }) => {
    if (!matchId || !userId || !socketId)
      throw new Error("matchID or userId or socketID missed !");

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_id")
      .filter((q) => q.eq(q.field("_id"), matchId))
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === userId)
      await ctx.db.patch(existingMatch._id, {
        user1SocketID: socketId,
      });
    else if (existingMatch.user2Id === userId)
      await ctx.db.patch(existingMatch._id, {
        user2SocketID: socketId,
      });
  },
});

// player is readys
export const getOpponentSocketID = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) throw new Error("matchID or userId or socketID missed !");

    const existingMatch = await ctx.db
      .query("match")
      .withIndex("by_user_id")
      .filter((q) =>
        q.or(q.eq(q.field("user1Id"), userId), q.eq(q.field("user2Id"), userId))
      )
      .first();

    if (!existingMatch) return null;

    if (existingMatch.user1Id === userId) return existingMatch.user2SocketID;
    else if (existingMatch.user2Id === userId)
      return existingMatch.user1SocketID;
  },
});
