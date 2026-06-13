import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const [company, setCompany] = useState("");
 const [position, setPosition] = useState("");
 const [status, setStatus] = useState("Applied");

 const [editableId, setEditableId] = useState(null);

 const [searchTerms, setSearchTerms] = useState("");

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

  const handleDelete = async(id) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method : "DELETE"
      });

      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error(err.message);
        setError(err.message);
    }
  }

  const handleEdit = (id) =>{
    setEditableId(id)
    const editableJob = jobs.find(job => job.id === id);
    const {company, position, status} = editableJob;
    setCompany(company);
    setPosition(position);
    setStatus(status)
    console.log(editableJob);
  };

  const handleUpdate = async () => {
    if (company && position && status) {
      try {
        const response = await fetch(`http://localhost:5000/jobs/${editableId}`, {
          method: "PUT",
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

        const updatedJob = await response.json();
        setJobs((prevJobs) => {
          return prevJobs.map((job) => {
            if(job.id === editableId){
              return {...job, ...updatedJob}
            }else{
              return job
            }
          })
        });
        setEditableId(null);
        setCompany("");
        setPosition("");
        setStatus("Applied");
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } 
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerms(value);
  }

  const filterJobsBySearch = (jobs, searchTerms) => {
    const validSearchTerm = searchTerms.toLowerCase().trim();
    return jobs.filter((job) => job.company.toLowerCase().trim().includes(validSearchTerm))
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
          <input type="text" id="company" name="company" placeholder='Ex. Amazon' value={company} onChange={(e) => handleFieldChange(e, setCompany)} />
          <label htmlFor="position">Position:</label>
          <input type="text" id="position" name="position" placeholder='Ex. React Developer' value={position} onChange={(e) => handleFieldChange(e, setPosition)} />
          <label htmlFor="status">Status:</label>
          <select name="status" id="status" value={status} onChange={(e) => handleFieldChange(e, setStatus)}>
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
          </select>
          {editableId ? <button onClick={handleUpdate}>Update</button> : <button onClick={handleSubmit}>submit</button>}
        </section>
        <hr />
        <section>
          <label htmlFor="searchJobs">Search Jobs : </label>
          <input type="text" id="searchJobs" placeholder='Search by company name...' value={searchTerms} onChange={handleSearchChange}/>
        </section>
        <section>
          {filterJobsBySearch(jobs, searchTerms).length === 0 && <div>No Jobs Found!</div>}
          <ul>
            {filterJobsBySearch(jobs, searchTerms).map((job) => {
              return (
                <li key={job.id}>
                  <span>{job.company}</span>
                  <span>{job.position}</span>
                  <span>{job.status}</span>
                  <button onClick={() => handleEdit(job.id)}>Edit</button>
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
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
