import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FormSelector = ({  setLoading, setMe, setError,id, onFormSelect  }) => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [selectedFormName, setSelectedFormName] = useState('');
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;

  // Fetch forms from backend
  const fetchForms = async () => {
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/forms/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setForms(response.data.reverse());
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Failed to fetch forms');
    }
  };

  // Handle form selection change
  const handleFormChange = (e) => {
    // const formId = e.target.value;
    // setMe(formId);
    // setSelectedFormId(formId);
    // onFormSelect(formId); //pass form id to parents me kiya
    const formId = e.target.value;
    const formName = forms.find((form) => form.form_id === formId)?.form_name; // Get the form name based on the selected form ID

    setMe(formId);
    setSelectedFormId(formId);
    setSelectedFormName(formName);
    onFormSelect(formId, formName); // Pass both form ID and form name to parent

  };

  // Handle fetch leads button click
  const handleFetchLeads = async () => {
    if (!selectedFormId) {
      setError('Please select a form');
      return;
    }

    setLoading(true);
    setError('Wait');

    try {
      // Fetch leads from Meta API via backend
      const response = await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/leads/fetch', {
        formId: selectedFormId
      });
      setError('Fetch leads Done');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads');
      setLoading(false);
    }
  };

  // fetchForms();
  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Select a Form
      </label>
      <select
        onChange={handleFormChange}
        className="border rounded w-full py-2 px-3 text-gray-700"
        value={selectedFormId}
      >
        <option value="">-- Select a Form --</option>
        {forms.map((form) => (
          <option key={form.id} value={form.form_id}>
            {form.form_name} (ID: {form.form_id})
          </option>
        ))}
      </select>

      {/* <button
        onClick={handleFetchLeads}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        Fetch Leads
      </button> */}
    </div>
  );
};

export default FormSelector;
