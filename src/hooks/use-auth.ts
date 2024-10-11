import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/provider/redux-provider';
import { login, signup, fetchUserById, resetUser, updateUserProfile } from '@/redux/useSlice';

interface Credentials {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ProfileUpdateData {
  firstname?: string;
  lastname?: string;
  email?: string;
  mobileNumber?: string;
  address?: string;
  // Add any additional fields needed for profile update.
}

const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  
  // Extracting the relevant parts of the Redux state
  const {
    user,
    loginStatus,
    signupStatus,
    fetchUserStatus,
    updateProfileStatus,
    error
  } = useSelector((state: RootState) => state.user);

  // Function to handle login
  const loginUser = async (credentials: Credentials) => {
    await dispatch(login(credentials));
  };
  
  // Function to handle signup
  const signupUser = async (data: SignupData) => {
    await dispatch(signup(data));
  };

  // Function to fetch the current user's profile (if logged in)
  const fetchUser = async () => {
    await dispatch(fetchUserById());
  };

  // Function to update the user profile
  const updateProfile = async (profileData: ProfileUpdateData) => {
    await dispatch(updateUserProfile(profileData));
  };

  // Logout function to clear user and token
  const logout = () => {
    dispatch(resetUser());
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  };

  // Effect to auto-fetch user data if they are already logged in (on mount)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(); // Auto-fetch the user if the token is available
    }
  }, [dispatch]);

  const isLoading = loginStatus === 'loading' || signupStatus === 'loading' || fetchUserStatus === 'loading' || updateProfileStatus === 'loading';
  const isSuccess = loginStatus === 'succeeded' || signupStatus === 'succeeded' || fetchUserStatus === 'succeeded' || updateProfileStatus === 'succeeded';
  const isError = loginStatus === 'failed' || signupStatus === 'failed' || fetchUserStatus === 'failed' || updateProfileStatus === 'failed';

  return {
    user,
    loginStatus,
    signupStatus,
    fetchUserStatus,
    updateProfileStatus,
    error,
    isLoading,   // New aggregated loading state
    isSuccess,   // New aggregated success state
    isError,     // New aggregated error state
    loginUser,
    signupUser,
    fetchUser,
    updateProfile,
    logout,
  };
};

export default useAuth;
