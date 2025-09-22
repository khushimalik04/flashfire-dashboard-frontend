import { Briefcase, FileText, TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserJobs } from '../state_management/UserJobs.tsx';
import { UserContext } from '../state_management/UserContext.js';
import { useUserProfile } from '../state_management/ProfileContext.tsx';
import LoadingScreen from './LoadingScreen.tsx';
import { calculateDashboardStats } from '../utils/storage.ts';
import NewUserModal from './NewUserModal.tsx'

const Dashboard: React.FC = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const { userProfile, isProfileComplete } = useUserProfile();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  if (!context) {
    console.error("UserContext is null");
    navigate('/login');
    return null;
  }

  const { token, userDetails, setData } = context;
  const { userJobs, setUserJobs, loading } = useUserJobs();
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  async function FetchAllJobs(localToken: string, localUserDetails: any) {
    try {
      setLoadingDetails(true);
      const res = await fetch(`${API_BASE_URL}/getalljobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUserJobs(data?.allJobs);
      } else if (data.message === 'invalid token please login again' || data.message === 'Invalid token or expired') {
        console.log('Token invalid, attempting refresh...');

        // Try to refresh token
        if (context?.refreshToken) {
          const refreshSuccess = await context.refreshToken();
          if (refreshSuccess) {
            // Retry the request with new token
            console.log('Token refreshed, retrying job fetch...');
            setTimeout(() => {
              if (context.token) {
                FetchAllJobs(context.token, context.userDetails);
              } else {
                navigate('/login');
              }
            }, 100);
            return;
          }
        }

        console.log('Token refresh failed, clearing storage and redirecting to login');
        localStorage.clear();
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  }

useEffect(() => {
  if (!token || !userDetails) {
    navigate('/login');
    return;
  }

  // Show welcome only on first login
  const welcomeFlag = localStorage.getItem('welcomeShown');
  if (!welcomeFlag) {
    // first time – show the message and set the flag
    setShowWelcome(true);
    localStorage.setItem('welcomeShown', 'true');
  } else {
    // not first time – don’t show
    setShowWelcome(false);
  }

  // Check if profile is complete
  if (!isProfileComplete) {
    setShowProfileModal(true);
  } else {
    setShowProfileModal(false);
  }

  FetchAllJobs(token, userDetails);
}, [token, userDetails, isProfileComplete]);




  if (loadingDetails) {
    return <LoadingScreen />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {showProfileModal && (
        <NewUserModal
          onProfileComplete={() => setShowProfileModal(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Career Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track your job applications, monitor your progress, and optimize your career journey with AI-powered insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">395</h3>
            <p className="text-gray-600 text-sm">Total Applications</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
            <p className="text-gray-600 text-sm">Active Interviews</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-orange-600 h-2 rounded-full w-1/4"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600 text-sm">Offers Received</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-green-600 h-2 rounded-full w-0"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0%</h3>
            <p className="text-gray-600 text-sm">Success Rate</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full w-0"></div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">390</h3>
                <p className="text-gray-600">Applications Sent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">3</h3>
                <p className="text-gray-600">Jobs Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Application Pipeline</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600">Applied</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Screening</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Interview</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Offer</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Rejected</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {/* Leasing Consultant */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Leasing Consultant</p>
                <p className="text-sm text-gray-500">thesciongroupllc</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Deleted</span>
              </div>
            </div>
            {/* Consultant, Marketing Compliance */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Consultant, Marketing Compliance</p>
                <p className="text-sm text-gray-500">ACA Group</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Deleted</span>
              </div>
            </div>
            {/* Technology Advisory Consultant */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Technology Advisory Consultant</p>
                <p className="text-sm text-gray-500">crowe</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Applied</span>
              </div>
            </div>
            {/* Kearney Senior Business Analyst, Strategic Operations (SOP) Make Tower */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Kearney Senior Business Analyst, Strategic Operations (SOP) Make Tower</p>
                <p className="text-sm text-gray-500">kearney</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Deleted</span>
              </div>
            </div>
            {/* Decision Analytics Associate Consultant - Life Sciences */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Decision Analytics Associate Consultant - Life Sciences</p>
                <p className="text-sm text-gray-500">ZS</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Interviewing</span>
              </div>
            </div>
            {/* FS Insurance Management Consultant - Senior Associate */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">FS Insurance Management Consultant - Senior Associate</p>
                <p className="text-sm text-gray-500">pwc</p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Deleted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message - show only first login */}
        {showWelcome && (
          <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Welcome aboard, {context?.userDetails?.name?.split(' ')[0] || 'User'}! 🎉</h3>
            <p className="text-orange-100">
              Your profile has been successfully set up. You can now start tracking your job applications,
              managing your career pipeline, and leveraging AI-powered insights to optimize your job search strategy.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;