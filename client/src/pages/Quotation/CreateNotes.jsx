import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteTexts, setNoteTexts] = useState([
    "Follow up with leads after the first contact.",
    "Schedule a demo for potential clients.",
    "Check in with existing clients for feedback.",
    "Review the sales pipeline for opportunities.",
    "Send thank-you emails after meetings.",
    "Update client information in the CRM.",
    "Prepare for the upcoming sales presentation.",
    "Set reminders for contract renewals.",
    "Document customer interactions for future reference.",
    "Analyze last quarter's sales performance.",
    "Create a marketing campaign for product launch.",
    "Conduct a training session for new CRM features.",
    "Gather feedback from the sales team on CRM usage.",
    "Track customer complaints and resolutions.",
    "Identify potential upsell opportunities with existing clients.",
    "Evaluate competitors' offerings and strategies.",
    "Plan a customer appreciation event.",
    "Follow up on outstanding invoices.",
    "Assess customer satisfaction through surveys.",
    "Maintain a list of FAQs for customer service.",
  ]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/notes_data`
        );
        // If you still want to merge fetched notes with dummy notes, you can do so
        // setNoteTexts(prevNotes => [...prevNotes, ...response.data]);
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
        const response = await axios.post("http://localhost:9000/api/notes", {
          noteTexts: [note],
          quotationId: id,
        });

        console.log("Note stored successfully:", response.data);
      }
      navigate(`/final-quotation/${id}`);
    } catch (error) {
      console.error("Error storing notes:", error);
    }
  };

  return (
    <div className="container mt-5">
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
        <button
          className="btn bg-blue-600 text-white mt-2 hover:bg-blue-700 rounded px-4 py-2"
          onClick={handleAddNote}
        >
          Add Note
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

      <button
        className="btn bg-green-600 text-white hover:bg-green-700 rounded px-4 py-2"
        onClick={handleCreateNotes}
      >
        Create Notes
      </button>

      <Link
        to={`/final-quotation/${id}`}
        className="btn bg-blue-600 text-white mx-4 hover:bg-blue-700 rounded px-4 py-2"
      >
        <i className="bi bi-arrow-return-left mx-1"></i> Back
      </Link>
    </div>
  );
};

export default CreateNotes;
