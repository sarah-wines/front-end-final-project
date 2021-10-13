import React, { useState, useEffect }from 'react';
import axios from 'axios'
import { LessonForm } from './LessonForm';
import { Lesson } from './Lesson';
import '../styles/inst.css';


export const LessonList = ({ auth }) => {
  const [lessons, setLessons] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const date = useState([new Date()]);
  const today = (String(date[0])).slice(0, 16);
  const [students, setStudents] = useState([]);
  // const [search, setSearch] = useState([]);

  useEffect(() => {
    if (auth || submitted) {
      axios
        .get(
          `https://music-mvp.herokuapp.com/api/upcoming/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `token ${auth}`,
            },
          }
        )
        .then((res) => {
          setLessons(res.data)

          if (res.status === 200){
            console.log('making new request')
            axios.get(`https://music-mvp.herokuapp.com/instructor/studio/`, 
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `token ${auth}`,
                },
              }
              )
              .then((response) => {
                // console.log(response)
                setStudents(response.data.students);
                // console.log(students)
                }
              )
        }
        
      });
      setSubmitted(false);
    } 
  }, [auth, submitted]);




    return (
        <div>
            <div className="instPage">
              <div className="lessonList">
                <h4>
                  Today is {today}
                </h4>
                <p>Here are your lessons for today:</p>  
                {lessons.map((lesson, index) => (
                  <div className="lessonCard" key={index}> {auth && <Lesson lesson={lesson} auth={auth} setSubmitted={setSubmitted}/>}</div>
                ))}
              </div>
              <div className="lessonForm">
              {auth && <LessonForm auth={auth} setSubmitted={setSubmitted} />}
              </div>
            </div>
            <>
            {students.map((student) => (
              <div className="studentList" key={student.pk}> 
                {student.first_name} {student.last_name}
                  {student.pk}
              </div>
            ))}
            </>
        </div>
    );
}
