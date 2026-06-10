import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const [company, setCompany] = useState("");
 const [position, setPosition] = useState("");
 const [status, setStatus] = useState("Applied");

 const handleFieldChange = (e, setField) => {
    setField(e.target.value);
 }

  const handleSubmit = async () => {
    if (company && position && status) {
      try {
        const response = await fetch("http://localhost:5000/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            company,
            position,
            status
          })
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const newJob = await response.json();
        setJobs(prevJobs => [...prevJobs, newJob]);
        setCompany("");
        setPosition("");
        setStatus("Applied");
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } 
    }
  }

 
  
  useEffect(() => {
    const getData = async (url) =>  {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        setJobs(result);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getData('http://localhost:5000/jobs');

  }, [])

  if(loading) return <div>Loading...</div>
  if(error) return <div>{error}</div>

  return (
    <div>
      <header>
        <h1>Job Tracker</h1>
      </header>
      <main>
      <section>
  
        <label htmlFor="company">Company:</label>
        <input type="text" id="company" name="company" value={company} onChange={ (e) => handleFieldChange(e, setCompany)}/>
        <label htmlFor="position">Position:</label>
        <input type="text" id="position" name="position" value={position} onChange={ (e) => handleFieldChange(e, setPosition)}/>
        <label htmlFor="status">Status:</label>
        <select name="status" id="status" value={status} onChange={ (e) => handleFieldChange(e, setStatus)}>
          <option value="Applied">Applied</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Rejected">Rejected</option>
        </select>
          <button onClick={handleSubmit}>submit</button>
      </section>
        <section>
          <ul>
            {jobs.map((job) => {
              return (
                <li key={job.id}>
                  <span>{job.company}</span>
                  <span>{job.position}</span>
                  <span>{job.status}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
      <footer>

      </footer>
    </div>
  )
}

export default App
