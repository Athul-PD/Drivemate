import DriveMateLogo from "../../../public/DriveMateLogo"
import Admin_pic from '../../../public/admin-logo.jpg'
import joiners_pic from '../../../public/team.jpg'
import { FaArrowRight } from "react-icons/fa6";
import { FiClipboard } from "react-icons/fi";
import { db,auth } from '../../firebase-auth/firebase'
import { addDoc,collection,serverTimestamp,query,where,getDocs } from 'firebase/firestore'
import '../../styles/AdminUser.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminUser = () => {

    const navigate = useNavigate();
    const { refreshWorkspaceStatus } = useAuth();

    const [adminName,setAdminName] = useState(false);
    const [code,setCode] = useState(false);
    const [companyName,setCompanyName] = useState('');
    const [joinerName,setJoinerName] = useState('');

    const generateCode = () => {
        return 'FL-' + Math.floor(10000 + Math.random() * 90000)
    }
    
    const showCreateTeamHandler = () => {
        setAdminName(true);
    }

    const showJoinersHandler = () => {
        setCode(true);
    }

    const cancelHandlerForAdmin = () => {
        setAdminName(false);
    }

    const cancelHandlerForJoiners = () => {
        setCode(false);
    }

    const createWorkspace = async () => {

        if(companyName === '') return alert('Please enter Ltd Name!')
        
        try{
            const user = auth.currentUser;
            if(!user){
                alert('User not logged in')
                return;
            }
            const workspaceRef = await addDoc(collection(db,'workspaces'),{
            name: companyName,
            code: generateCode(),
            createdBy: user.uid,
            createdAt: serverTimestamp()
        })

        await addDoc(collection(db,'workspaceMembers'),{
            workspaceId: workspaceRef.id,
            userId: user.uid,
            userName: user.email,
            userEmail: user.email,
            role: 'admin',
            joinedAt: serverTimestamp()
        })
        
        // Refresh workspace status in auth context
        await refreshWorkspaceStatus(user.uid);
        
        alert('Workspace created Sucessfully!')
        setCompanyName('');
        setAdminName(false);
        navigate('/dashboard')

        }catch(err){
            console.error(err);
            alert('Error creating Workspace')
        }
    }

    const joinWorkspace = async () => {

        const code = joinerName.trim();
        if(code === '') return alert('Please enter team code!')

        try {
            const user = auth.currentUser;

            if(!user){
                alert('User not logged in');
                return;
            }

            const q = query(collection(db,'workspaces'),where('code','==',code));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.empty){
                alert('Invalid team code');
                return;
            }

            const workspaceDoc = querySnapshot.docs[0];

            // Prevent duplicate membership
            const memberQuery = query(
                collection(db,'workspaceMembers'),
                where('workspaceId','==',workspaceDoc.id),
                where('userId','==',user.uid)
            );
            const memberSnapshot = await getDocs(memberQuery);
            if(!memberSnapshot.empty){
                alert('You are already a member of this team');
                setJoinerName('');
                setCode(false);
                return;
            }

            // Add member
            await addDoc(collection(db,'workspaceMembers'),{
                workspaceId: workspaceDoc.id,
                userId: user.uid,
                userName: user.email,
                userEmail: user.email,
                role: 'member',
                joinedAt: serverTimestamp()
            })

            // Refresh workspace status in auth context
            await refreshWorkspaceStatus(user.uid);

            alert('Joined workspace sucessfully!')
            setJoinerName('');
            setCode(false);
            navigate('/dashboard');

        } catch(err){
            console.log('Faild to join Team!')
            console.error(err)
        }
    }

    const pasteFromClipboard = async () => {
        try {
            const text = (await navigator.clipboard.readText())?.trim();
            if (text) setJoinerName(text);
        } catch {
            // ignore
        }
    }


  return (
    <div className="main_page_adminUser bg-gray-900 min-h-screen w-full flex flex-col items-center justify-center text-white">
        <div className="admin_header flex flex-col items-center gap-[20px]">
            <DriveMateLogo/>
            <p className="mb-[25px]">Manage your  expenses with your team</p>
        </div>

        <div className="cards_container flex items-start gap-[50px]">

        <div className="card w-[400px] h-auto bg-slate-800 rounded-[12px] p-[18px]">
            <img className="image w-full h-[200px]" src={Admin_pic} alt="Admin background image" />
            <div className="p-[10px]">
                <span className="text-xs bg-slate-600 py-[2px] px-[12px] rounded-[20px]">ADMIN</span>
                <h1 className="font-black text-[20px] my-[4px]">Create a Team</h1>
                <p className="text-[13px]">Set up your drivemate workspace and invite your team members to track expenses together.</p>

                {
                    adminName && <div className="createTeam">
                    <p className="text-xs my-[10px]">Team Name</p>
                    <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} className="border w-full p-[3px] rounded-[10px] pl-[15px]" type="text" placeholder="e.g. Express Ltd" />
                    <div className="buttons flex gap-[15px] my-[10px]">
                        <button onClick={cancelHandlerForAdmin} className="text-black bg-white text-[14px] p-[5px] rounded-[6px] font-bold w-1/3 hover:bg-gray-200">Cancel</button>
                        <button onClick={createWorkspace} className="text-white bg-blue-500 text-[14px] p-[5px] rounded-[6px] font-bold w-full hover:bg-blue-600">Create Team</button>
                    </div>
                </div>
                }

                {
                    !adminName && <button onClick={showCreateTeamHandler} className="flex items-center justify-center w-full my-[12px] bg-blue-600 hover:bg-blue-700 rounded-[12px] p-[5px] font-bold">Get Started <FaArrowRight size={15} className="mx-[10px]"/></button>
                }

                
            </div>
        </div>

        <div className="card w-[400px] h-auto bg-slate-800 rounded-[12px] p-[18px]">
            <img className="image w-full h-[200px]" src={joiners_pic} alt="joiners background image" />
            <div className="p-[10px]">
                <span className="text-xs bg-slate-600 py-[2px] px-[12px] rounded-[20px]">MEMBER</span>
                <h1 className="font-black text-[20px] my-[4px]">Join a Team</h1>
                <p className="text-[13px]">Enter your team code to join an existing drivemate workspace and start collaborating.</p>

                {
                    code && (
                      <div className="createTeam">
                        <p className="text-xs my-[10px]">Team Code</p>
                        <div className="flex gap-2">
                          <input
                            value={joinerName}
                            onChange={(e)=>setJoinerName(e.target.value)}
                            className="border w-full p-[3px] rounded-[10px] pl-[15px]"
                            type="text"
                            placeholder="e.g. FL-12345"
                          />
                          <button
                            type="button"
                            onClick={pasteFromClipboard}
                            className="text-gray-400 hover:text-white bg-slate-700 px-3 rounded-[10px]"
                            title="Paste from clipboard"
                          >
                            <FiClipboard />
                          </button>
                        </div>
                        <div className="buttons flex gap-[15px] my-[10px]">
                            <button onClick={cancelHandlerForJoiners} className="text-black bg-white text-[14px] p-[5px] rounded-[6px] font-bold w-1/3 hover:bg-gray-200">Cancel</button>
                            <button onClick={joinWorkspace} className="text-white bg-green-500 text-[14px] p-[5px] rounded-[6px] font-bold w-full hover:bg-green-600">Join Team</button>
                        </div>
                      </div>
                    )
                }

                {
                    !code && <button onClick={showJoinersHandler} className="flex items-center justify-center w-full my-[12px] bg-green-600 hover:bg-green-700 rounded-[12px] p-[5px] font-bold">Join Now <FaArrowRight size={15} className="mx-[10px]"/></button>
                }
            </div>
        </div>

        </div>


    </div>
  )
}

export default AdminUser
