import {mutation, query} from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args:{},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
    },
})

export const createTask = mutation({
    args: { title: v.string(), description: v.string(), status: v.string() },
    handler: async (ctx, args) => {
        const taskId = { title: args.title, description: args.description, status: "todo" };
        return await ctx.db.insert("tasks", taskId);
    },
});

export const updateTask = mutation({
    args: { id: v.id("tasks"), title: v.string(), description: v.string() },
    handler: async (ctx, { id, title, description }) => {
        await ctx.db.patch(id, { title, description });
    },
});

export const updateStatus = mutation({
    args: { id: v.id("tasks"), status: v.string() },
    handler: async (ctx, { id, status }) => {
        await ctx.db.patch(id, { status });
    },
});

export const deleteTask = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});
