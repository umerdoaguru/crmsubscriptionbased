import React, { useState } from 'react'
import MainHeader from './../MainHeader';
import Sider from '../Sider';


import { GiFiles } from 'react-icons/gi';
import { SiMoneygram } from 'react-icons/si';


import WebsiteLeads from './../SocialMediaLeads/WebsiteApi/WebsiteLeads';
import Accrs from './../SocialMediaLeads/AccrsLeads';
import LeadsTable from './../SocialMediaLeads/FacebookAPI/LeadsTable';
import { useNavigate } from 'react-router-dom';




function SocialMediaLeads() {
    const [selectedComponent, setSelectedComponent] = useState('FacebookData');  // Set 'FacebookData' as default
  const navigate = useNavigate();
  return (
   <>
   <MainHeader/>
   <Sider/>

   <div className="container 2xl:w-[93%] 2xl:ml-32 ">   
    <div className="mt-[7rem] mx-4 ">
      <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
          </div>
      <h1 className="text-2xl text-center  font-medium">Social Media Leads</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="flex flex-wrap justify-around mt-3">
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3 ">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === 'FacebookData' ? 'bg-blue-500 text-white' : ''
              }`}  // Change background color if active
              onClick={() => setSelectedComponent('FacebookData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className={`text-3xl ${selectedComponent === 'FacebookData' ? 'text-white' : 'text-gray-700'}`}>
                  <GiFiles />
                </div>
                <div className="mt-2">
                  <h5 className={`text-xl font-semibold ${selectedComponent === 'FacebookData' ? 'text-white' : 'text-gray-800'}`}>Facebook Leads Data</h5>
                  <p className={`${selectedComponent === 'FacebookData' ? 'text-white' : 'text-gray-600'}`}>{}</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === 'WebsiteData' ? 'bg-blue-500 text-white' : ''
              }`}  // Change background color if active
              onClick={() => setSelectedComponent('WebsiteData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className={`text-3xl ${selectedComponent === 'WebsiteData' ? 'text-white' : 'text-gray-700'}`}>
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5 className={`text-xl font-semibold ${selectedComponent === 'WebsiteData' ? 'text-white' : 'text-gray-800'}`}>Website Leads Data</h5>
                  <p className={`${selectedComponent === 'WebsiteData' ? 'text-white' : 'text-gray-600'}`}>{}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
            <div
              className={` shadow-lg rounded-lg overflow-hidden cursor-pointer ${
                selectedComponent === '99AcresData' ? 'bg-blue-500 text-white' : ''
              }`}  // Change background color if active
              onClick={() => setSelectedComponent('99AcresData')}  // Set selected component
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div className={`text-3xl ${selectedComponent === '99AcresData' ? 'text-white' : 'text-gray-700'}`}>
                  <SiMoneygram />
                </div>
                <div className="mt-2">
                  <h5 className={`text-xl font-semibold ${selectedComponent === '99AcresData' ? 'text-white' : 'text-gray-800'}`}>99Acres Leads Data</h5>
                  <p className={`${selectedComponent === '99AcresData' ? 'text-white' : 'text-gray-600'}`}>{}</p>
                </div>
              </div>
            </div>
          </div> */}


         
        </div>

        {/* Conditionally render the selected component */}
        <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
          {/* {selectedComponent === 'FacebookData' && <FacebookLeads />} */}
          {selectedComponent === 'FacebookData' && <LeadsTable />}
          {selectedComponent === 'WebsiteData' && < WebsiteLeads/>}
          {selectedComponent === '99AcresData' && < Accrs/>}
       
        </div>
      </div>
   
   
   </>
  )
}

export default SocialMediaLeads