import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainHeader from "../../MainHeader";
import EmployeeeSider from "../EmployeeSider";

const CreateNotesBylead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteTexts, setNoteTexts] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/notes_data`
        );
        setNoteTexts(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const handleNoteSelection = (e) => {
    const selectedNote = e.target.value;
    setNewNote(""); // Reset the new note input when selecting an existing note
    setSelectedNotes([...selectedNotes, selectedNote]);
  };

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      setSelectedNotes([...selectedNotes, newNote]);
      setNewNote("");
    }
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = [...selectedNotes];
    updatedNotes.splice(index, 1);
    setSelectedNotes(updatedNotes);
  };

  const handleCreateNotes = async () => {
    try {
      for (const note of selectedNotes) {
        const response = await axios.post("https://crmdemo.vimubds5.a2hosted.com/api/notes", {
          noteTexts: [note],
          quotationId: id,
        });

        console.log("Note stored successfully:", response.data);
      }
      navigate(`/final-quotation-by-lead/${id}`);
    } catch (error) {
      console.error("Error storing notes:", error);
    }
  };

  return (
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col  2xl:ml-44 mt-14  max-w-7xl">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create New Notes</h2>

          <select
            className="form-select mb-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value=""
            onChange={handleNoteSelection}
          >
            <option value="" disabled>
              Select an existing note
            </option>
            {noteTexts.map((text, index) => (
              <option key={index} value={text}>
                {text}
              </option>
            ))}
          </select>

          <div className="mb-3">
            <input
              type="text"
              className="form-control mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a new note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white mt-2 hover:bg-blue-700 rounded px-6 py-2 transition duration-300 ease-in-out"
              onClick={handleAddNote}
            >
              Add Note
            </button>
            <button
              className="bg-green-600 text-white mt-2 hover:bg-green-700 rounded px-6 py-2 transition duration-300 ease-in-out"
              onClick={handleCreateNotes}
            >
              Create Notes
            </button>
          </div>

          {selectedNotes.length > 0 && (
            <div className="mb-3">
              <h5 className="text-lg font-semibold mb-2">Selected Notes:</h5>
              <ul className="list-disc pl-5">
                {selectedNotes.map((note, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    {note}
                    <button
                      className="btn bg-red-600 text-white text-sm hover:bg-red-700 rounded px-2 py-1"
                      onClick={() => handleRemoveNote(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* <Link
          to={`/final-quotation-by-lead/${id}`}
          className="btn bg-blue-600 text-white mx-4 hover:bg-blue-700 rounded px-4 py-2"
        >
          <i className="bi bi-arrow-return-left mx-1"></i> Back
        </Link> */}
        </div>
      </div>
    </>
  );
};

export default CreateNotesBylead;
