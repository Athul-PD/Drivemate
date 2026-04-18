import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase-auth/firebase";

const Members = ({ workspaceId, workspace }: any) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "workspaceMembers"), where("workspaceId", "==", workspaceId));
        const snapshot = await getDocs(q);
        const membersData = snapshot.docs.map((doc) => doc.data());
        // Sort members - creator first, then joiners
        const sortedMembers = membersData.sort((a: any, b: any) => {
          if (a.userId === workspace?.createdBy) return -1;
          if (b.userId === workspace?.createdBy) return 1;
          return 0;
        });
        setMembers(sortedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceId, workspace]);

  const isCreator = (userId: string) => workspace?.createdBy === userId;

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="w-full flex flex-col gap-3 md:gap-[15px] p-4 md:p-0">
      <div className="p-4 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none">
        <h1 className="text-lg md:text-[24px] font-bold text-white">Team Members</h1>
        <p className="text-gray-400 text-xs md:text-sm">Manage and view your team members</p>
      </div>

      <div className="p-4 md:p-[18px]">
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            <p>Loading members...</p>
          </div>
        ) : members.length > 0 ? (
          <>
            {/* Desktop Table View (lg and above) */}
            <div className="hidden lg:block overflow-x-auto bg-slate-800 rounded-lg p-4 md:p-5">
              <table className="w-full text-left text-white text-sm">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-4 text-xs md:text-sm">Name</th>
                    <th className="px-4 py-4 text-xs md:text-sm">Email</th>
                    <th className="px-4 py-4 text-xs md:text-sm">Role</th>
                    <th className="px-4 py-4 text-xs md:text-sm">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member: any, index: number) => {
                    const isOwner = isCreator(member.userId);
                    return (
                      <tr key={index} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="px-4 py-4 text-xs md:text-sm font-medium">
                          {member.userName?.split('@')[0] || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-400">{member.userEmail || 'N/A'}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isOwner 
                              ? 'bg-amber-900 text-amber-300' 
                              : 'bg-green-900 text-green-300'
                          }`}>
                            {isOwner ? 'Admin' : 'Member'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-400">
                          {formatDate(member.joinedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden flex flex-col gap-3">
              <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="text-sm md:text-base font-semibold text-white">
                  Total Members: <span className="text-blue-400">{members.length}</span>
                </h3>
              </div>
              {members.map((member: any, index: number) => {
                const isOwner = isCreator(member.userId);
                return (
                  <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Name</p>
                        <p className="text-sm font-medium text-white">{member.userName?.split('@')[0] || 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${
                        isOwner 
                          ? 'bg-amber-900 text-amber-300' 
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {isOwner ? 'Admin' : 'Member'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-gray-400 mb-1">Email</p>
                        <p className="text-gray-300 break-all">{member.userEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Joined</p>
                        <p className="text-gray-300">{formatDate(member.joinedAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No team members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
