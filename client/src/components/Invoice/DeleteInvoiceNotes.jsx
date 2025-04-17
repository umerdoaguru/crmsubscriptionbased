import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const DeleteInvoiceNotes = () => {
  const { id } = useParams();

  const [notes, setNotes] = useState([]);

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Notes?"
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:9000/api/delete-notes/${noteId}`
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
      const response = await axios.get(
        `http://localhost:9000/api/invoice-get-notes/${id}`
      );

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
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold mb-4">Delete Notes</h1>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-center justify-between bg-white p-4 shadow-md rounded-md"
          >
            <span className="text-lg">{note.note_text}</span>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => handleDeleteNote(note.id)}
            >
              Delete Note
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link
          to={`/print-invoice/${id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Back to Print Invoice
        </Link>
      </div>
    </div>
  );
};

export default DeleteInvoiceNotes;
