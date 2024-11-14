import "./todo.css";
import {useMutation, useQuery} from "convex/react";
import { api } from "../../convex/_generated/api";
import {useEffect, useState} from "react";

type Task = {
    title: string;
    description: string;
    status: string;
};

export default function Todo() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // ID de la tâche en cours d'édition
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const fetchedTasks = useQuery(api.task.get) || [];
    useEffect(() => {
        setTasks(fetchedTasks);
    }, [fetchedTasks]);

    const addTaskMutation = useMutation(api.task.createTask);

    const handleAddTask = async () => {
        const task: Task = {
            title: title,
            description: description,
            status: "todo"
        };
        await addTaskMutation(task);
        setTasks([...tasks, task]);
    };

    const updateTaskMutation = useMutation(api.task.updateTask);
    const handleUpdateTask = async (taskId: string) => {
        await updateTaskMutation({ id: taskId, title: editTitle, description: editDescription });
        setTasks(prevTasks => prevTasks.map(task =>
            task._id === taskId ? { ...task, title: editTitle, description: editDescription } : task
        ));
        setEditingTaskId(null);
    };

    const statusTaskMutation = useMutation(api.task.updateStatus);

    const handleStatusTask = async (taskId: string, status: string) => {
        await statusTaskMutation({ id: taskId, status: status });
    };

    const deleteTaskMutation = useMutation(api.task.deleteTask);

    const handleDeleteTask = async (taskId: string) => {
        await deleteTaskMutation({ id: taskId });
    };

    const handleEditClick = (task: Task) => {
        setEditingTaskId(task._id || null);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
    };

    return (
        <div className="todo">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>

            <div className="todo-list flex flex-row text-center">
                <div className="flex flex-col flex-1">
                    <h2>todo</h2>
                    <ul>
                        {tasks.filter(task => task.status === 'todo').map((task, index) => (
                            <li key={index} className="flex flex-col bg-white rounded-md text-black">
                                {editingTaskId === task._id! ? (
                                    <>
                                        <input className="bg-white"
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input className="bg-white"
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateTask(task._id!)}>Valider</button>
                                        <button onClick={handleCancelEdit}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        <span>Title: {task.title}</span>
                                        <span>Description: {task.description}</span>
                                        <button onClick={() => handleStatusTask(task._id!, "in progress")}>in progress</button>
                                        <div>
                                            <button onClick={() => handleEditClick(task)}>Modifier</button>
                                            <button onClick={() => handleDeleteTask(task._id!)}>Supprimer</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col flex-1">
                    <h2>in progress</h2>
                    <ul>
                        {tasks.filter(task => task.status === 'in progress').map((task, index) => (
                            <li key={index} className="flex flex-col bg-white rounded-md text-black">
                                {editingTaskId === task._id! ? (
                                    <>
                                        <input className="bg-white"
                                               type="text"
                                               value={editTitle}
                                               onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input className="bg-white"
                                               type="text"
                                               value={editDescription}
                                               onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateTask(task._id!)}>Valider</button>
                                        <button onClick={handleCancelEdit}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        <span>Title: {task.title}</span>
                                        <span>Description: {task.description}</span>
                                        <button onClick={() => handleStatusTask(task._id!, "done")}>done</button>
                                        <div>
                                            <button onClick={() => handleEditClick(task)}>Modifier</button>
                                            <button onClick={() => handleDeleteTask(task._id!)}>Supprimer</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col flex-1">
                    <h2>done</h2>
                    <ul>
                        {tasks.filter(task => task.status === 'done').map((task, index) => (
                            <li key={index} className="flex flex-col bg-white rounded-md text-black">
                                {editingTaskId === task._id! ? (
                                    <>
                                        <input className="bg-white"
                                               type="text"
                                               value={editTitle}
                                               onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input className="bg-white"
                                               type="text"
                                               value={editDescription}
                                               onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateTask(task._id!)}>Valider</button>
                                        <button onClick={handleCancelEdit}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        <span>Title: {task.title}</span>
                                        <span>Description: {task.description}</span>
                                        <button onClick={() => handleStatusTask(task._id!, "todo")}>remettre dans todo</button>
                                        <div>
                                            <button onClick={() => handleEditClick(task)}>Modifier</button>
                                            <button onClick={() => handleDeleteTask(task._id!)}>Supprimer</button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
