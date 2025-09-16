import AccountSettings from "../components/SettingsComponent/AccountSettings";
import ProfileSettings from "../components/SettingsComponent/Profile";

export default function Settings() {
    return (
        <div className="mx-5 sm:mt-20 mt-5">
            <h1 className="font-bold text-2xl mb-4">Settings</h1>

            {/* Grid layout to mirror screenshot: header row, then two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-2">
                {/* Left: Profile header + personal information */}
                <div className="lg:col-span-3 space-y-5">
                    <ProfileSettings />
                </div>

                {/* Right: Achievement summary card lives inside Profile component via a propless layout slot */}

            </div>

            {/* Bottom row cards: Notifications and Goal Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8">
                <AccountSettings variant="notifications" />
                <AccountSettings variant="preferences" />
            </div>
        </div>
    )
}
