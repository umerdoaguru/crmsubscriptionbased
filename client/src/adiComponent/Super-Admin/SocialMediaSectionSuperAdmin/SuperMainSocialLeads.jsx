import React, { useState } from 'react'

import { GiFiles } from 'react-icons/gi';
import { SiMoneygram } from 'react-icons/si';

import SuperLeadsTable from './SuperFacebookAPI/SuperLeadsTable';
import SuperWebsiteLeads from './SuperWebsiteLeads';
import SuperAccrs from './SuperAccrsLeads';
import MainHeader from '../../../components/MainHeader';
import SuperAdminSider from '../SuperAdminSider';




function SuperMainSocialLeads() {
    const [selectedComponent, setSelectedComponent] = useState('FacebookData');  // Set 'FacebookData' as default

  return (
   <>
   <MainHeader/>
   <SuperAdminSider/>

   <div className="container 2xl:w-[93%] 2xl:ml-32 ">
      <h1 className="text-2xl text-center mt-[5rem] font-medium">Social Media Leads</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

        <div className="flex flex-wrap justify-around mt-5">
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

          <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 my-3 p-0 sm-mx-0 mx-3">
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
          </div>


         
        </div>

        {/* Conditionally render the selected component */}
        <div className="w-full h-[calc(100vh-10rem)] overflow-y-auto">
          {/* {selectedComponent === 'FacebookData' && <FacebookLeads />} */}
          {selectedComponent === 'FacebookData' && <SuperLeadsTable />}
          {selectedComponent === 'WebsiteData' && < SuperWebsiteLeads/>}
          {selectedComponent === '99AcresData' && < SuperAccrs/>}
       
        </div>
      </div>
   
   
   </>
  )
}

export default SuperMainSocialLeads;