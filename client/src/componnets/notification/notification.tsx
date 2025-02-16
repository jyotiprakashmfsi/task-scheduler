import React, { useEffect, useState } from "react";
import { NotificationApi } from "../../services/notification/api";
import { useUser } from "../../context/UserContext";
import { Task } from "../tasks/task-component";
import { tasksService } from "../../services/tasks/api";

interface TaskWithType extends Task {
  notificationType: "approaching" | "overdue";
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<TaskWithType[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskWithType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user, token } = useUser();

  const fetchNotifications = async () => {
    if (!user?.id || !token) return;

    try {
      const approaching = await NotificationApi.approachingTasks(
          user.id,
          token
        ),
        overdue = await NotificationApi.overdueTasks(user.id, token);

      const approachingWithType = approaching.map((task: Task) => ({
        ...task,
        notificationType: "approaching" as const,
      }));

      const overdueWithType = overdue.map((task: Task) => ({
        ...task,
        notificationType: "overdue" as const,
      }));

      setNotifications([...overdueWithType, ...approachingWithType]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // fetch notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, token]);

  const handleTaskClick = (task: TaskWithType) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleMarkAsDone = async () => {
    if (!selectedTask?.id || !token) return;

    try {
      await tasksService.markDone(selectedTask.id, token);
      setShowModal(false);
      setSelectedTask(null);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:max-w-md md:max-w-lg">
        <div className="flex flex-col gap-2 max-h-[60vh] md:max-h-96 overflow-y-auto px-4 md:px-0">
          {notifications.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className={`bg-white rounded-lg shadow-lg p-3 md:p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200 border-l-4 ${
                task.notificationType === "overdue"
                  ? "border-red-500"
                  : "border-yellow-500"
              } w-full`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 min-w-0">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full mt-1.5 bg-${task.colour}`}></div>
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {task.task_name}
                  </h3>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full self-start md:self-center whitespace-nowrap ${
                    task.notificationType === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.notificationType === "overdue" ? "Overdue" : "Due Soon"}
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Due {new Date(task.end_time).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">Tap to manage</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-[90vw] md:max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg md:text-xl font-semibold">Task Details</h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full self-start md:self-center ${
                    selectedTask.notificationType === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedTask.notificationType === "overdue"
                    ? "Overdue"
                    : "Due Soon"}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className={`w-3 h-3 rounded-full mt-1.5 bg-${selectedTask.colour}`}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {selectedTask.task_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedTask.description}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">
                    Due: {new Date(selectedTask.end_time).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleMarkAsDone}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto"
                >
                  Mark as Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationComponent;
