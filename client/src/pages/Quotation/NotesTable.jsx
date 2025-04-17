import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesTable = ({ quotationId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Fetch notes for the given quotationId
    axios
      .get(`http://localhost:9000/api/notes?quotationId=${quotationId}`)
      .then((response) => setNotes(response.data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, [quotationId]);

  const handleAddNote = () => {
    // Add a new note
    axios
      .post("http://localhost:9000/api/notes", {
        noteText: newNote,
        quotationId,
      })
      .then((response) => {
        setNotes([...notes, { id: response.data.id, note_text: newNote }]);
        setNewNote("");
      })
      .catch((error) => console.error("Error adding note:", error));
  };

  const handleDeleteNote = (id) => {
    // Delete a note
    axios
      .delete(`http://localhost:9000/api/notes/${id}`)
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((error) => console.error("Error deleting note:", error));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Note Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.note_text}</td>
              <td>
                <button onClick={() => handleDeleteNote(note.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>
    </div>
  );
};

export default NotesTable;
