import { useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

export const LogForm = ({ auth }) => {
  const [body, setBody] = useState('');
  const [timePracticed, setTimePracticed] = useState('');
  const history = useHistory();
  const { pk } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        'https://music-mvp.herokuapp.com/api/practices',
        {
          body: body,
          time_practiced: timePracticed,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${auth}`,
          },
        }
      )
      .then((res) => {
        setBody('');
        setTimePracticed('');

        // history.push(`/lessons/${pk}/`);
      });
  };

  const handleChange = (inputType, event) => {
    if (inputType === 'body') {
      setBody(event.target.value);
    }
    if (inputType === 'time_practiced') {
      setTimePracticed(event.target.value);
    }
  };
  return (
    <>
      <form className="form-group" onSubmit={handleSubmit}>
        <label for="exampleFormControlTextarea1">Practice Log</label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="What did you practice?"
          type="text"
          value={body}
          onChange={(e) => handleChange('body', e)}
        ></textarea>
        <div className="form-group">
          <input
            type="text"
            value={timePracticed}
            className="form-control"
            placeholder="How long did you practice?"
            onChange={(e) => handleChange('time_practiced', e)}
          />
        </div>
        <div className="button">
          <button type="submit" className="btn btn-dark">
            Save Log
          </button>
        </div>
      </form>
    </>
  );
};
