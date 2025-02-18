import React, { useEffect, useState } from "react";
import { RiAddFill, RiMoreLine } from "react-icons/ri";
import { useUser } from "../../context/UserContext";
import { tasksService } from "../../services/tasks/api";
import { getLocalTimeString, isOverdue } from "../../services/date/date";

export interface Task {
  id?: number;
  task_name?: string;
  description: string;
  status: string;
  end_time: string;
  start_time: string;
  tags: string;
  repeat_freq: number;
  remind_time: number;
  colour: string;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function TaskComponent() {
  const { user, token } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const formatDateForAPI = (dateStr: string) => {
    return new Date(dateStr).toISOString();
  };

  const [newTask, setNewTask] = useState<Task>({
    task_name: "",
    description: "",
    end_time: getLocalTimeString(new Date(Date.now() + 5 * 60000)),
    start_time: getLocalTimeString(new Date()),
    tags: "",
    repeat_freq: 0,
    remind_time: 5,
    colour: "#87CEEB",
    user_id: user?.id || 0,
    status: "pending",
  });

  const handleNewTask = () => {
    setIsModalOpen(true);
    setNewTask({
      task_name: "",
      description: "",
      end_time: getLocalTimeString(new Date(Date.now() + 5 * 60000)),
      start_time: getLocalTimeString(new Date()),
      tags: "",
      repeat_freq: 0,
      remind_time: 5,
      colour: "#87CEEB",
      user_id: user?.id || 0,
      status: "pending",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTask({
      task_name: "",
      description: "",
      end_time: getLocalTimeString(new Date(Date.now() + 5 * 60000)),
      start_time: getLocalTimeString(new Date()),
      tags: "",
      repeat_freq: 0,
      remind_time: 5,
      colour: "#87CEEB",
      user_id: user?.id || 0,
      status: "pending",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskToSend = {
      ...newTask,
      start_time: formatDateForAPI(newTask.start_time),
      end_time: formatDateForAPI(newTask.end_time),
      user_id: user?.id || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingTask?.id) {
        console.log("taskToSend", taskToSend)
        await tasksService.updateTask(taskToSend, editingTask.id, token || "");
      } else {
        await tasksService.createTask(taskToSend, token || "");
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setNewTask({
      ...task,
      start_time: task.start_time.slice(0, 16),
      end_time: task.end_time.slice(0, 16),
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksService.deleteTask(taskId, token || "");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleMarkDone = async (taskId: number) => {
    try {
      await tasksService.markDone(taskId, token || "");
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const handleUnmarkDone = async (taskId: number) => {
    try {
      await tasksService.unmarkDone(taskId, token || "");
      fetchTasks();
    } catch (error) {
      console.error("Error unmarking task:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user?.id, currentPage]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await tasksService.getTasks(user?.id || 0, token || "", currentPage);
      setTasks(response.tasks);
      console.log(response.tasks)
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-black">
      <div className="flex justify-between items-center flex-row mb-6">
        <h1 className="text-2xl text-black font-bold">Tasks</h1>
        <button
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={handleNewTask}
        >
          <RiAddFill />
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-6">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 p-4 rounded-lg hover:shadow-lg bg-white"
            >
              <div className="flex flex-col justify-between items-start gap-4 md:flex-row">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {/* <div className={`w-4 h-4 rounded-full bg-${task.colour} `}></div> */}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: task.colour }}
                    ></div>
                    <h2 className="font-semibold text-lg truncate">
                      {task.task_name}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status === "pending" ? "Pending" : "Completed"}
                    </span>
                    <span>
                      {isOverdue(task.end_time) &&
                        task.status === "pending" && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {getLocalTimeString(new Date(task.start_time))}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{getLocalTimeString(new Date(task.end_time))}</span>
                    </div>
                    {task.tags && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags
                          .slice(0, -1)
                          .split(", ")
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() =>
                      task.id &&
                      (task.status === "pending"
                        ? handleMarkDone(task.id)
                        : handleUnmarkDone(task.id))
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      task.status === "pending"
                        ? "bg-indigo-600 text-white hover:bg-indigo-800"
                        : "bg-gray-200 text-indigo-700 hover:bg-gray-300"
                    }`}
                  >
                    {task.status === "pending"
                      ? "Mark Complete"
                      : "Mark Pending"}
                  </button>

                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        const dropdown = document.getElementById(`${task.id}`);
                        if (dropdown) {
                          dropdown.classList.toggle("hidden");
                        }
                      }}
                    >
                      <RiMoreLine size={20} className="text-gray-500" />
                    </button>
                    <div
                      id={`${task.id}`}
                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                        onClick={() => handleEditClick(task)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600 flex items-center gap-2"
                        onClick={() => task.id && handleDeleteTask(task.id)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 
              ${currentPage === 1 || isLoading 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'}`}
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 
              ${currentPage === totalPages || isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'}`}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 text-black bg-black/60 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    name="task_name"
                    value={newTask.task_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter task name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={newTask.end_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    // min={getLocalTimeString(new Date())}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={newTask.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* <div className="grid grid-cols-2 gap-4"> */}
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Repeat Frequency (days)
                    </label>
                    <input
                      type="number"
                      name="repeat_freq"
                      value={newTask.repeat_freq}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remind Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="remind_time"
                    value={newTask.remind_time}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {/* </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      "#FFB6C1",
                      "#FFD700",
                      "#90EE90",
                      "#87CEEB",
                      "#FF69B4",
                      "#FFA07A",
                      "#D8BFD8",
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setNewTask((prev) => ({ ...prev, colour: color }))
                        }
                        className={`w-8 h-8 rounded-full`}
                        style={{
                          backgroundColor: color,
                          boxShadow:
                            newTask.colour === color
                              ? "0 0 0 2px #4F46E5, 0 0 0 4px white"
                              : "0 0 0 0px rgba(209, 213, 219, 0.5)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingTask ? "Save Changes" : "Add Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
