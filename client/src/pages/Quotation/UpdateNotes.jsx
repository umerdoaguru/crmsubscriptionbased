import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateNotes = () => {
  const [notes, setNotes] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/notes/${id}`
        );
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [id]); // Include id in the dependency array to re-fetch notes when id changes

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:9000/api/notes`, {
        notes,
      });

      if (response.data.success) {
        console.log("Notes updated successfully");
        navigate(`/final-quotation/${id}`);
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...notes];
    newNotes[index].note_text = value;
    setNotes(newNotes);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Notes</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
            <textarea
              rows="3"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
              value={note.note_text}
              onChange={(e) => handleNoteChange(index, e.target.value)}
            />
            <input type="hidden" name={`notes[${index}][id]`} value={note.id} />
            <input
              type="hidden"
              name={`notes[${index}][quotation_id]`}
              value={note.quotation_id}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white hover:bg-green-700 rounded px-4 py-2 mx-4"
        >
          Update Notes
        </button>
        <Link
          to={`/final-quotation/${id}`}
          className="bg-blue-600 text-white hover:bg-blue-700 rounded px-4 py-2 mt-4 inline-block"
        >
          <i className="bi bi-arrow-return-left mx-1"></i> Back
        </Link>
      </form>
    </div>
  );
};

export default UpdateNotes;
