import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/studentdash.css';

export const EditAssignment = ({ auth, note, pk, noteId, setShow, setModalTitle }) => {
  const lesson = pk;
  const [body, setBody] = useState(note);
  const history = useHistory();

  const handleEdit = (event, id) => {
    event.preventDefault();
    axios
      .patch(
        `https://music-mvp.herokuapp.com/api/note/${noteId}/`,
        { body: body, lesson: `${lesson}` },

        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${auth}`,
          },
        }
      )
      .then((res) => {
        setShow(true)
        setModalTitle('Homework note updated!')
        setBody('');
        history.push(`/lessons/${lesson}/`);
      });
  };

  return (
    <>
      <div className="card">
        <div div className="card-header assignment-form">
          <h4>Homework for Student</h4>
        </div>
        <div class="form-group">
          <form
          onSubmit={(event) => {
            handleEdit(event);
          }}
          >
            <textarea
              className="form-control lesson-detail"
              defaultValue={body}
              placeholder="Click to edit"
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            ></textarea>
            <button
              className="btn btn-general lesson-detail"
              id={pk}
              onClick={(e) => {
                handleEdit(e);
              }}
            >
              Send to Student
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
