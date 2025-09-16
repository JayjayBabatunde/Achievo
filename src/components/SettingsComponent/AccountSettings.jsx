import { Trophy } from "lucide-react";

export default function AccountSettings({ variant = "notifications", successRate = 0, completedGoals, totalGoals }) {
    if (variant === "summary") {
        return (
            <div className="rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-base font-semibold mb-4">Achievement Summary</h3>

                <div className="flex flex-col items-center py-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                        <Trophy color="blue" />
                    </div>
                    <div className="text-3xl font-bold">{successRate}%</div>
                    <div className="text-xs text-gray-500">Success Rate (current month)</div>
                </div>

                <div className="space-y-4 mt-2">
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span>Goals Completed</span>
                            <span>{completedGoals} out of {totalGoals}</span>

                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${Math.min(completedGoals / totalGoals * 100, 100)}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span>Current Streak</span>
                            <span>15 days</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "preferences") {
        return (
            <div className="rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-base font-semibold mb-4">Goal Preferences</h3>

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium mb-1">Default Goal View</label>
                        <div className="relative">
                            <select className="w-full bg-gray-50 border border-gray-300 text-black text-sm rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500">
                                <option>Card View</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">Reminder Frequency</label>
                        <select className="w-full bg-gray-50 border border-gray-300 text-black text-sm rounded-md px-3 py-2 focus:ring-teal-500 focus:border-teal-500">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    // Notifications (default)
    return (
        <div className="rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-base font-semibold mb-4">Notification Settings</h3>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium">Email Notifications</h4>
                        <p className="text-xs text-gray-500">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium">Push Notifications</h4>
                        <p className="text-xs text-gray-500">Get instant updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
