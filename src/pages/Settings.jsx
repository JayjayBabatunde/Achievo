import AccountSettings from "../components/SettingsComponent/AccountSettings";
import ProfileSettings from "../components/SettingsComponent/Profile";

export default function Settings() {
    return (
        <div className="mx-5">
            <h1 className="font-bold text-xl">Settings</h1>

            <div className="flex gap-20 py-5">
                <div className="w-2/3">
                    <ProfileSettings />
                </div>

                <div className="w-full">
                    <AccountSettings />
                </div>


            </div>
        </div>
    )
}
