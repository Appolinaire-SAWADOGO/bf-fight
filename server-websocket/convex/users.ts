import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const store = mutation({
  args: {
    userImageSc: v.string(),
  },
  handler: async (ctx, { userImageSc }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (
        user.firstName !== identity.familyName &&
        user.lastName !== identity.givenName
      ) {
        await ctx.db.patch(user._id, {
          userId: identity.subject,
        });
      }

      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      userId: identity.subject,
      firstName: identity.givenName as string,
      lastName: identity.familyName as string,
      matchNumber: 0,
      winNumber: 0,
      loseNumber: 0,
      imageSrc: userImageSc,
    });
  },
});
