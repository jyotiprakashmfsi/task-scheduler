import TaskComponent from "../../componnets/tasks/task-component";
import Sidebar from "../../componnets/sidebar";

export default function TasksPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="text-black/70 flex gap-2 items-center mb-6">
            <span className="hover:text-black">Tasks Scheduler</span>
            <span>/</span>
            <span className="text-black">Tasks</span>
          </div>
          <TaskComponent />
        </div>
      </div>
    </div>
  );
}
