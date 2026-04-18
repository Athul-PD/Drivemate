import { FcGoogle } from "react-icons/fc";
import '../../styles/Signin.css'
import {useForm} from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import DriveMateLogo from "../../../public/DriveMateLogo";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from "../../firebase-auth/firebase";
import { useAuth } from "../../context/AuthContext";

interface SigninData {
  Email: string;
  Password: string;
}

const Signin = () => {

    const navigate = useNavigate();
    const { checkUserWorkspace } = useAuth();

    const navigateToSignup = () => {
        navigate('/')
    }

  const schema = yup.object().shape({
    Email: yup.string().email().required(),
    Password: yup.string().min(6).max(18).required(),
  })

  const {register,handleSubmit,reset,formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  });

  const submitted = async (data: SigninData) => {
    try{
      await signInWithEmailAndPassword(auth,data.Email,data.Password)
      const user = auth.currentUser;
      if (user) {
        try {
          const hasWorkspace = await checkUserWorkspace(user.uid);
          if (hasWorkspace) {
            navigate('/dashboard');
          } else {
            navigate('/adminuser');
          }
        } catch (workspaceError) {
          console.log('Error checking workspace:', workspaceError);
          navigate('/adminuser');
        }
      } else {
        navigate('/adminuser');
      }
      reset()
    }catch{
      console.log('Signin Error')
    }
  }

  const handleGoogleSignin = async () => {
    try{
      await signInWithPopup(auth,googleProvider);
      const user = auth.currentUser;
      if (user) {
        try {
          const hasWorkspace = await checkUserWorkspace(user.uid);
          if (hasWorkspace) {
            navigate('/dashboard');
          } else {
            navigate('/adminuser');
          }
        } catch (workspaceError) {
          console.log('Error checking workspace:', workspaceError);
          navigate('/adminuser');
        }
      } else {
        navigate('/adminuser');
      }
    }catch{
      console.log('Google Signin Error')
    }
  }

  return (
    <div className="main_signin_container text-white bg-slate-900 w-full min-h-screen px-[25px] py-[25px] flex items-center flex-col">
      <div className="signin_container w-1/2 flex flex-col items-center p-[25px]">
      <DriveMateLogo height='60px'/>
      <h1 className="text-[1.6rem] font-bold my-[25px]">Sign in to your account</h1>
      <form className="w-full" onSubmit={handleSubmit(submitted)}>
        <div className="email my-[10px]">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="border border-white rounded-[8px] h-[40px] w-full" {...register('Email')}/>
          </div>
          <p className="text-red-500 text-sm">{errors.Email?.message}</p>
        </div>
        <div className="pswrd my-[10px]">
          <div>
            <label htmlFor="pswrd">Password</label>
            <input id="pswrd" type="password" className="border border-white rounded-[8px] h-[40px] w-full" {...register('Password')}/>
            <p className="text-red-500 text-sm">{errors.Password?.message}</p>
          </div>
        </div>
        <button className="font-medium w-full p-[7px] rounded-[8px] bg-blue-600 hover:bg-blue-700">SIGNIN</button>
        <p className="text-center my-[10px]">OR</p>
          <div onClick={handleGoogleSignin} className=" flex items-center justify-center gap-[10px] bg-slate-700 hover:bg-slate-800 h-[40px] rounded-[8px]">
            <span><FcGoogle /></span>
            <p>Continue with google</p>
          </div>
          <p className="text-center my-[10px]">Don't have an account? <span onClick={navigateToSignup} className="text-blue-500">Signup</span></p>
      </form>
      </div>
    </div>
  )

}

export default Signin
