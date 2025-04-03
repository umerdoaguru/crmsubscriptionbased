import { useState } from 'react';
import axios from 'axios';

const SuperFormInput = ({ setShowForm,onFormSubmit,id }) => {
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to save form ID and form name
      const response = await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/forms', {
        formId,
        formName,project_id:id
      });

      if (response.status === 200) {
        setSuccess('Form saved successfully!');
        setError('');
        setFormId('');
        setFormName('');
        setShowForm(false);  // Hide form on successful submit
          // Trigger LeadsTable refresh
          onFormSubmit();
      }
    } catch (err) {
      console.error('Error saving form:', err);
      setError('Failed to save form');
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Form Details</h1>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Form ID
          </label>
          <input
            type="number"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
            placeholder="Enter Form ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
            placeholder="Enter Form Name"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Form
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}  // Hide form on cancel
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuperFormInput;
