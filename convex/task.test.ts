import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test ("authentification et création d'une tache", async () => {
    const t = convexTest(schema);

    const user =  t.withIdentity({ email: "test@test.fr" });
    await user.mutation(api.task.createTask, { title: "Tâche de test 1", description: "Ceci est une tâche de test", status: "todo" });

    const tasks = await user.query(api.task.get);
    expect(tasks).toContainEqual(expect.objectContaining({
        title: "Tâche de test 1",
        description: "Ceci est une tâche de test",
        status: "todo"
    }));
});

test("authentification et liste des tâches", async () => {
    const t = convexTest(schema);

    const user =  t.withIdentity({ email: "test@test.fr" });
    await user.mutation(api.task.createTask, {
        title: "Tâche de test 1",
        description: "Description de la première tâche",
        status: "todo"
    });
    await user.mutation(api.task.createTask, {
        title: "Tâche de test 2",
        description: "Description de la deuxième tâche",
        status: "todo"
    });

    const tasks = await t.query(api.task.get);
    tasks.sort((a, b) => a.title.localeCompare(b.title));

    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toMatchObject({
        title: "Tâche de test 1",
        description: "Description de la première tâche",
        status: "todo"
    });
    expect(tasks[1]).toMatchObject({
        title: "Tâche de test 2",
        description: "Description de la deuxième tâche",
        status: "todo"
    });
});

test("authentification et modification d'une tâche", async () => {
    const t = convexTest(schema);

    const user =  t.withIdentity({ email: "test@test.fr" });

    const task = await user.mutation(api.task.createTask, {
        title: "Tâche à modifier",
        description: "Description de la tâche",
        status: "todo"
    });

    const tasks = await t.query(api.task.get);

    await user.mutation(api.task.updateTask, { id: tasks[0]._id, title: "Tâche modifiée", description: "Description modifiée" });

    const updatedTask = await t.query(api.task.get);

    expect(updatedTask[0]).toMatchObject({
        title: "Tâche modifiée",
        description: "Description modifiée"
    });
});

test("authentification et mise à jour du statut d'une tâche", async () => {
    const t = convexTest(schema);

    const user =  t.withIdentity({ email: "test@test.fr" });

    const task = await user.mutation(api.task.createTask, {
        title: "Tâche à mettre à jour",
        description: "Description de la tâche",
        status: "in progress"
    });

    const tasks = await t.query(api.task.get);

    await user.mutation(api.task.updateStatus, { id: tasks[0]._id, status: "in progress" });

    const updatedTask = await t.query(api.task.get);

    expect(updatedTask[0].status).toBe("in progress");
});

test("authentification et suppression d'une tâche", async () => {
    const t = convexTest(schema);

    const user =  t.withIdentity({ email: "test@test.fr" });

    const task = await user.mutation(api.task.createTask, {
        title: "Tâche à supprimer",
        description: "Description de la tâche",
        status: "in progress"
    });

    const tasks = await t.query(api.task.get);
    const idToRemember = tasks[0]._id

    await user.mutation(api.task.deleteTask, { id: idToRemember});

    expect(tasks).not.toContainEqual(expect.objectContaining({ id: idToRemember }));
});
