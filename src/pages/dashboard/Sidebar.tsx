import { IoMdHome } from "react-icons/io";
import { TbTransactionRupee } from "react-icons/tb";
import { SiSimpleanalytics } from "react-icons/si";
import { IoPeople } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-auth/firebase";
import { useNavigate } from "react-router-dom";
import DriveMateLogoT from "../../../public/DriveMateLogo-2"

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { id: "home", label: "Dashboard", icon: <IoMdHome size={22} /> },
    { id: "transactions", label: "Transactions", icon: <TbTransactionRupee size={21} /> },
    { id: "search", label: "Search by Date", icon: <FiCalendar size={20} /> },
    { id: "analytics", label: "Analytics", icon: <SiSimpleanalytics size={15} /> },
    { id: "members", label: "Members", icon: <IoPeople size={20} /> },
    { id: "settings", label: "Settings", icon: <MdOutlineSettings size={20} /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white px-[15px] w-[240px] border-r-[0.5px] border-slate-700">

      {/* Top */}
      <div className="pt-[15px] px-[10px]">
        <DriveMateLogoT/>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-3 mt-5 border-t-[0.5px] border-slate-700 pt-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`p-[8px] rounded-[5px] cursor-pointer transition ${
              currentPage === item.id
                ? "bg-slate-700 text-blue-400 border-l-2 border-blue-400"
                : "hover:bg-slate-700 text-gray-300"
            }`}
          >
            <p className="flex items-center gap-[10px] font-medium">
              <span>{item.icon}</span>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t-[0.5px] border-slate-700 pt-3 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-[10px] px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
        >
          <HiOutlineLogout /> Logout
        </button>
      </div>

    </div>
  )
}

export default Sidebar
