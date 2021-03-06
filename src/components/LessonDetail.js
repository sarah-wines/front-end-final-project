import { useEffect, useState } from 'react';
import axios from 'axios';
import { AssignmentForm } from './AssignmentForm.js';
import { EditAssignment } from './EditAssignment.js';
import { EditLessonPlan } from './EditLessonPlan.js';
import { Loading } from './Loading';
import { ConfirmModal } from './ConfirmModal.js';
import '../styles/studentdash.css';
import { Container } from 'react-bootstrap';

export const LessonDetail = ({
  auth,
  props,
  pk,
  show,
  setShow,
  isLoading,
  setIsLoading,
  modalTitle,
  setModalTitle,
}) => {
  const [lesson, setLesson] = useState({});
  const [previous, setPrevious] = useState({});

  useEffect(() => {
    async function getLesson() {
      await axios
        .get(
          'https://music-mvp.herokuapp.com/api/lessons/' +
            props.match.params.pk,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `token ${auth}`,
            },
          }
        )
        .then((response) => {
          setLesson(response.data);

          if (response.status === 200) {
            axios
              .get(
                `https://music-mvp.herokuapp.com/api/assignments/${response.data.student}/previous/${response.data.pk}`,

                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${auth}`,
                  },
                }
              )
              .then((response) => {
                setIsLoading(false);
                setPrevious(response.data[1]);
              });
          }
        });
    }
    getLesson();
  }, [props, auth, pk]);

  return isLoading ? (
    <>
      <Loading />
    </>
  ) : (
    <>
      <Container>
        <ConfirmModal show={show} setShow={setShow} modalTitle={modalTitle} />
        <header className="dash-header">
          <h2> {lesson.student_name}'s lesson</h2>{' '}
          <h4>
            {lesson.lesson_date} at {lesson.lesson_time}{' '}
          </h4>
        </header>
        <div className="dash-body col-xxl-12 row flex-lg-row justify-content-center">
          <div className="body-item col-lg-6">
            <div className="plan">
              <EditLessonPlan
                auth={auth}
                lesson={lesson}
                show={show}
                setShow={setShow}
                modalTitle={modalTitle}
                setModalTitle={setModalTitle}
              />
            </div>
          </div>

          <div className="body-item col-lg-6">
            <div className="assignment">
              {lesson.note && !!lesson.note.length ? (
                String(lesson.note[0].body) && (
                  <EditAssignment
                    auth={auth}
                    pk={lesson.pk}
                    note={lesson.note[0].body}
                    noteId={lesson.note[0].pk}
                    show={show}
                    setShow={setShow}
                    modalTitle={modalTitle}
                    setModalTitle={setModalTitle}
                  />
                )
              ) : (
                <>
                  <AssignmentForm
                    auth={auth}
                    setShow={setShow}
                    setModalTitle={setModalTitle}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="dash-body col-xxl-12 row flex-lg-row justify-content-center">
          <div className="body-item-lesson-det col-lg-6">
            <h5> Notes from last lesson on {previous.lesson_date} </h5>
            <div className="prevLsn">
              <p className="lessonTxt">{previous.plan}</p>
            </div>
          </div>
          <div className="body-item-lesson-det col-lg-6">
            <h5> Assignment from last lesson on {previous.lesson_date} </h5>
            <div className="prevLsn">
              {previous.note && previous.note.length ? (
                <p className="lessonTxt">{previous.note[0].body}</p>
              ) : (
                <p className="lessonTxt">no previous assignment exists</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
