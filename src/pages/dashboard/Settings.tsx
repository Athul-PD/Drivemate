import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-auth/firebase";
import { useNavigate } from "react-router-dom";

const Settings = ({ workspace }: any) => {
  const navigate = useNavigate();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 md:gap-[15px] p-4 md:p-0">
      <div className="p-4 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none">
        <h1 className="text-lg md:text-[24px] font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-xs md:text-sm">Manage your workspace settings and preferences</p>
      </div>

      <div className="px-4 md:px-[18px] pb-4 md:pb-0 flex flex-col gap-3 md:gap-6">
        {/* Workspace Settings */}
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <h2 className="text-sm md:text-lg font-bold text-white mb-4">Workspace Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">Workspace Name</p>
              <p className="text-white font-semibold text-sm md:text-lg truncate">{workspace?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">Team Code</p>
              <p className="text-white font-semibold text-sm md:text-lg font-mono">{workspace?.code || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">Created By</p>
              <p className="text-white font-semibold text-sm md:text-base">{workspace?.createdByName || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">Members Count</p>
              <p className="text-white font-semibold text-sm md:text-base">{workspace?.memberCount || '0'}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <h2 className="text-sm md:text-lg font-bold text-white mb-4">Account</h2>
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 text-xs md:text-sm">Manage your account security and preferences</p>
            <button className="w-full px-3 md:px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold transition text-xs md:text-sm">
              Change Password
            </button>
            <button className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-700 text-white rounded-lg font-semibold transition text-xs md:text-sm">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900 bg-opacity-20 p-4 md:p-6 rounded-lg border border-red-700">
          <h2 className="text-sm md:text-lg font-bold text-red-400 mb-4">Danger Zone</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 active:bg-red-800 text-white rounded-lg font-semibold transition text-xs md:text-sm"
            >
              {isLogoutLoading ? 'Logging out...' : 'Logout'}
            </button>
            <p className="text-gray-400 text-xs">
              Once you logout, you'll be signed out from your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
