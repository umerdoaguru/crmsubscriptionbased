import React from "react";
import { Link } from "react-router-dom";
import { MdManageAccounts, MdPeople, MdAdminPanelSettings } from "react-icons/md";
import { FaUserShield, FaUsers, FaCrown } from "react-icons/fa";

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CRM Platform
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Streamline your workflow with our powerful customer relationship management solution
          </p>
          <div className="mt-6">
            <p className="text-yellow-400 font-medium">
              ✨ Choose your access level to get started ✨
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Super Admin Card */}
            <Link to="/SuperAdmin-login" className="group">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 border border-purple-500/20">
                <div className="text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6 shadow-lg">
                    <FaCrown className="text-3xl text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Super Admin
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-purple-200 font-medium mb-4">
                    Full System Access
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Complete control over all features and settings with administrative privileges.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      System Administration
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      User Management
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      Complete Access
                    </div>
                  </div>
                  
                  {/* Button */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-white font-semibold">Get Started →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Card */}
            <Link to="/admin-login" className="group">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 border border-blue-500/20">
                <div className="text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-400 rounded-full mb-6 shadow-lg">
                    <FaUserShield className="text-3xl text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Admin
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-blue-200 font-medium mb-4">
                    Management Access
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Manage departments, users, and oversee daily operations with administrative privileges.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Department Management
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      User Oversight
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Operational Control
                    </div>
                  </div>
                  
                  {/* Button */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-white font-semibold">Get Started →</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Employee Card */}
            <Link to="/employee-login" className="group">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 border border-emerald-500/20">
                <div className="text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-400 rounded-full mb-6 shadow-lg">
                    <FaUsers className="text-3xl text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Employee
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-emerald-200 font-medium mb-4">
                    Workspace Access
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Access your personalized workspace, tasks, and collaborate with your team members.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Personal Workspace
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Task Management
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Team Collaboration
                    </div>
                  </div>
                  
                  {/* Button */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-white font-semibold">Get Started →</span>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-2">
            Powered by <span className="text-purple-400 font-semibold"><Link to="https://doaguru.com/" target="_blank">Doaguru Infosystems</Link></span>
          </p>
          <p className="text-gray-500 text-xs mb-4">
            © 2025 DOAGuru InfoSystems. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <span className="hover:text-purple-400 cursor-pointer transition-colors"><Link to="https://crm.doaguru.com" target="_blank">Privacy Policy</Link></span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors"><Link to="https://crm.doaguru.com" target="_blank">Terms of Service</Link></span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors"><Link to="https://crm.doaguru.com" target="_blank">Contact</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
