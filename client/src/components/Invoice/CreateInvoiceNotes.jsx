import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateInvoiceNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteTexts, setNoteTexts] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

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
        const response = await axios.post(
          "https://crmdemo.vimubds5.a2hosted.com/api/invoice-notes",
          {
            noteTexts: [note],
            invoiceId: id,
          }
        );

        console.log("Note stored successfully:", response.data);
      }
      navigate(`/print-invoice/${id}`);
    } catch (error) {
      console.error("Error storing notes:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Notes</h2>

      <div className="mb-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
          onClick={handleAddNote}
        >
          Add Note
        </button>
      </div>

      {selectedNotes.length > 0 && (
        <div className="mb-4">
          <h5 className="text-lg font-medium mb-2">Selected Notes:</h5>
          <ul className="list-disc list-inside">
            {selectedNotes.map((note, index) => (
              <li key={index} className="flex items-center justify-between">
                {note}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
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
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
        onClick={handleCreateNotes}
      >
        Create Notes
      </button>

      <Link
        to={`/print-invoice/${id}`}
        className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
      >
        <i className="bi bi-arrow-return-left mx-1"></i> Back
      </Link>
    </div>
  );
};

export default CreateInvoiceNotes;
