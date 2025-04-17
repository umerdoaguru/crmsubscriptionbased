import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const DeleteNotes = () => {
  const { id } = useParams();

  const [notes, setNotes] = useState([]);

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Notes?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:9000/api/notes/${noteId}`
        );

        if (response.status === 200) {
          console.log("Note deleted successfully");
          // Refresh notes after deletion
          fetchNotes();
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/notes/${id}`);

      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-3xl font-bold mb-4">Delete Notes</h1>
      <ul className="list-disc pl-5">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex justify-between items-center mb-2 p-3 border border-gray-300 rounded-md"
          >
            <span>{note.note_text}</span>
            <button
              className="bg-red-600 text-white hover:bg-red-700 rounded px-4 py-2"
              onClick={() => handleDeleteNote(note.id)}
            >
              Delete Note
            </button>
          </li>
        ))}
      </ul>
      <br />
      <Link
        to={`/final-quotation/${id}`}
        className="bg-blue-600 text-white hover:bg-blue-700 rounded px-4 py-2 inline-block mt-4"
      >
        Back to Final Quotation
      </Link>
    </div>
  );
};

export default DeleteNotes;
