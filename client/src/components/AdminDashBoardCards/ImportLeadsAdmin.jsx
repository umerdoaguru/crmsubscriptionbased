import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useSelector } from 'react-redux';
import MainHeader from '../MainHeader';
import Sider from '../Sider';
import cogoToast from 'cogo-toast';



const ImportLeadsAdmin = () => {
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
  const userId = adminuser.user_id;

  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectUnits, setProjectUnits] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [assignedDate, setAssignedDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchProjectUnits();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`https://crm-generalize.dentalguru.software/api/employee/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`https://crm-generalize.dentalguru.software/api/all-project/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProjects(res.data);

      
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchProjectUnits = async (projectId) => {
    try {
      const res = await axios.get(`https://crm-generalize.dentalguru.software/api/super-admin-project-unit/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProjectUnits(res.data);
    } catch (err) {
      console.error("Error fetching project units:", err);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = parseInt(e.target.value, 10);
    console.log(projects);
    
    const proj = projects.find(p => p.main_project_id === projectId);
    setSelectedProjectId(projectId);
 
    
    setSelectedProjectName(proj?.project_name || "");
    setSelectedUnitType("");
    fetchProjectUnits(projectId);
  };

  const handleEmployeeChange = (e) => {
    const employeeId = parseInt(e.target.value, 10); // Convert to number
    const emp = employees.find(emp => emp.employeeId === employeeId);
    setSelectedEmployee(employeeId);

    setSelectedEmployeeName(emp?.name || "");
  };
  

  const handleUnitChange = (e) => {
    const unitType = e.target.value;
    const unit = projectUnits.find(u => u.unit_type === unitType);
    setSelectedUnitType(unitType);
    setSelectedUnitId(unit?.unit_id || "");
  };


  const handleSubmit = async () => {
    if (!file || !selectedEmployee || !selectedProjectId || !selectedUnitType || !assignedDate) {
      cogoToast.warn("Please fill all fields and upload a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("employeeId", selectedEmployee);
    formData.append("assignedTo", selectedEmployeeName);
    formData.append("main_project_id", selectedProjectId);
    formData.append("project_name", selectedProjectName);
    formData.append("unit_type", selectedUnitType);
    formData.append("unit_id", selectedUnitId);
    formData.append("assignedBy", "SuperAdmin");
    formData.append("assigned_date", assignedDate);

  
    try {
      setLoading(true);
      const res = await axios.post("https://crm-generalize.dentalguru.software/api/import-leads", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      cogoToast.success(res.data.message || "Leads imported successfully");
  
      // Clear form
      setFile(null);
      setFileKey(Date.now());
      setSelectedEmployee("");
      setSelectedEmployeeName("");
      setSelectedProjectId("");
      setSelectedProjectName("");
      setSelectedUnitType("");
      setSelectedUnitId("");
      setProjectUnits([]);
      setAssignedDate("");
      
    } catch (err) {
      console.error("Upload failed:", err);
      cogoToast.error(err.response?.data?.error || "Failed to import leads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainHeader />
      <Sider />
      <div className="mt-[6rem] 2xl:ml-40">
        <div className=" text-center mx-2">
        <center className="text-2xl text-center  font-medium">
           Import Data 
          </center>
          <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>

          <div className="">
            <label>Upload File only .xlsx,.csv</label>
            <br />
            <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files[0])} className="border rounded-2xl p-2 xl:w-1/4 w-full"
    key={fileKey}/>
          </div>
          <a 
  href="/sample_leads.xlsx" 
  download 
  className="text-blue-600 underline hover:text-blue-800"
>
  Download Sample Excel File
</a>


          <div className="mb-3 mt-2">
            <label>Select Employee</label>
            <br />
            <select value={selectedEmployee} onChange={handleEmployeeChange} className="border rounded-2xl p-2 xl:w-1/4 w-full"
>
              <option value="">Select</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Select Project</label>
            <br />
            <select value={selectedProjectId} onChange={handleProjectChange} className="border rounded-2xl p-2 xl:w-1/4 w-full"
>
              <option value="">Select</option>
              {projects.map((proj) => (
                <option key={proj.main_project_id} value={proj.main_project_id}>{proj.project_name}</option>
              ))}
            </select>
          </div>

          {projectUnits.length > 0 && (
            <div className="mb-3">
              <label>Select Unit Type</label>
              <br />
              <select value={selectedUnitType} onChange={handleUnitChange} className="border rounded-2xl p-2 xl:w-1/4 w-full"

              >
                <option value="">Select</option>
                {projectUnits.map((unit) => (
                  <option key={unit.unit_id} value={unit.unit_type}>{unit.unit_type}</option>
                ))}
              </select>
            </div>
          )}

<div className="mb-3">
  <label>Assigned Date</label>
  <br />
  <input
    type="date"
    value={assignedDate}
    onChange={(e) => setAssignedDate(e.target.value)}
    className="border rounded-2xl p-2 xl:w-1/4 w-full"

  />
</div>


          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Import Leads"}
          </button>

          {message && <p className="mt-3 text-green-600">{message}</p>}

  
        </div>
      </div>
    </>
  );
};

export default ImportLeadsAdmin;
