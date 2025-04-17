import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import MainHeader from "../../MainHeader";
import EmployeeeSider from "../EmployeeSider";

const DeleteNoteBylead = () => {
  const { id } = useParams();

  const [notes, setNotes] = useState([]);

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Note?"
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
    <>
      <MainHeader />
      <EmployeeeSider />
      <div className="flex flex-col 2xl:ml-44 mt-14 max-w-7xl">
        <h1 className="text-3xl text-center font-bold mb-4">Delete Notes</h1>
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
        <span className="flex justify-center">
          <Link to={`/final-quotation-by-lead/${id}`}>
            <button className="bg-blue-600 text-white hover:bg-blue-700 rounded px-4 py-2 mt-4">
              Back to Final Quotation
            </button>
          </Link>
        </span>
      </div>
    </>
  );
};

export default DeleteNoteBylead;
