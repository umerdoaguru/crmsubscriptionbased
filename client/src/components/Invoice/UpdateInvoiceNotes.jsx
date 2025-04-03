import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateInvoiceNotes = () => {
  const [notes, setNotes] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `https://crmdemo.vimubds5.a2hosted.com/api/invoice-get-notes/${id}`
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
      const response = await axios.put(
        `https://crmdemo.vimubds5.a2hosted.com/api/invoice-update-notes`,
        { notes }
      );

      if (response.data.success) {
        console.log("Notes updated successfully");
        navigate(`/print-invoice/${id}`);
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
    <div className="container">
      <h2>Update Notes</h2>
      <form onSubmit={handleUpdate} className="form-control mb-2 mt-2">
        {notes.map((note, index) => (
          <div key={index}>
            <textarea
              rows="3"
              cols="50"
              className="form-control mt-2"
              value={note.note_text}
              onChange={(e) => handleNoteChange(index, e.target.value)}
            />
            {/* <input type="hidden" name={`notes[${index}][id]`} value={note.id} />
            <input type="hidden" name={`notes[${index}][quotation_id]`} value={note.quotation_id} /> */}
          </div>
        ))}

        <button type="submit" className="btn btn-success mt-3">
          Update Notes
        </button>
        <Link
          to={`/print-invoice/${id}`}
          className="btn btn-primary mt-3 mx-2 "
        >
          <i className="bi bi-arrow-return-left mx-1"></i> Back
        </Link>
      </form>
    </div>
  );
};

export default UpdateInvoiceNotes;
