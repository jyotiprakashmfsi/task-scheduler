import Sidebar from "../../componnets/sidebar";
import SettingsComponent from "../../componnets/settings/settings-component";
import NotificationComponent from "../../componnets/notification/notification";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 w-full">
        <div className="p-8">
          <div className="flex justify-between">
            <div className="text-black/70 flex gap-2 items-center mb-6">
              <span className="hover:text-black">Tasks Scheduler</span>
              <span>/</span>
              <span className="text-black">Settings</span>
            </div>
            <NotificationComponent />
          </div>
          <SettingsComponent />
        </div>
      </div>
    </div>
  );
}
