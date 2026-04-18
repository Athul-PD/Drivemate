import { useState, useEffect } from "react";
import Home from "./Home";
import Transactions from "./Transactions";
import SearchTransactions from "./SearchTransactions";
import Analytics from "./Analytics";
import Members from "./Members";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { collection, onSnapshot,query,where,getDocs,doc,getDoc } from "firebase/firestore";
import { db } from "../../firebase-auth/firebase";
import { auth } from "../../firebase-auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {

  const [currentPage, setCurrentPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [workspaceId,setWorkspaceId] =  useState<string | null>(null);
  const [workspace,setWorkspace] =  useState<any>(null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setWorkspaceId(null);
        setWorkspace(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        return;
      }

      const memberQuery = query(collection(db, "workspaceMembers"), where("userId", "==", user.uid));
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      unsubscribeSnapshot = onSnapshot(memberQuery, async (snapshot) => {
        if (!snapshot.empty) {
          const wsId = snapshot.docs[0].data().workspaceId;
          setWorkspaceId(wsId);

          const workspaceRef = doc(db, "workspaces", wsId);
          const workspaceSnap = await getDoc(workspaceRef);
          if (workspaceSnap.exists()) {
            setWorkspace(workspaceSnap.data());
            return;
          }
        }

        // Fall back to owner workspace (in case membership doc isn't created yet)
        const ownerQuery = query(collection(db, "workspaces"), where("createdBy", "==", user.uid));
        const ownerSnapshot = await getDocs(ownerQuery);
        if (!ownerSnapshot.empty) {
          const ownerWorkspace = ownerSnapshot.docs[0];
          setWorkspaceId(ownerWorkspace.id);
          setWorkspace(ownerWorkspace.data());
          return;
        }

        setWorkspaceId(null);
        setWorkspace(null);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {

    if(!workspaceId) return

    const q = query(
      collection(db,"transactions"),where("workspaceId","==",workspaceId)
    )
    const unsubscribe = onSnapshot(q,(snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
      }))
      setTransactions(data)
    })
    return () => unsubscribe();

  }, [workspaceId]);

  const renderPage = () => {
    switch(currentPage) {
      case "home":
        return <Home transactions={transactions} workspaceId={workspaceId} workspace={workspace} />;
      case "transactions":
        return <Transactions transactions={transactions} workspaceId={workspaceId} />;
      case "search":
        return <SearchTransactions transactions={transactions} />;
      case "analytics":
        return <Analytics transactions={transactions} workspace={workspace} />;
      case "members":
        return <Members workspaceId={workspaceId} workspace={workspace} />;
      case "settings":
        return <Settings workspace={workspace} />;
      default:
        return <Home transactions={transactions} workspaceId={workspaceId} workspace={workspace} />;
    }
  };

  return (
    <div className="relative w-full bg-slate-900 min-h-screen text-white">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'
      }`}>
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Mobile overlay - removed to show content */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden pointer-events-auto"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top bar for mobile */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 hover:bg-slate-700 rounded-lg"
          >
            {sidebarOpen ? <AiOutlineClose size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
          <h1 className="text-lg font-bold">DriveMate</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-[240px] md:w-[calc(100%-240px)] w-full min-h-screen overflow-y-auto pt-16 md:pt-0">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;