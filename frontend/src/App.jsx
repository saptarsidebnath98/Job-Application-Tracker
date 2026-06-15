import { useEffect, useState } from 'react'


function App() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const [company, setCompany] = useState("");
 const [position, setPosition] = useState("");
 const [status, setStatus] = useState("Applied");

 const [editableId, setEditableId] = useState(null);

 const [searchTerms, setSearchTerms] = useState("");
 const [currentFilter, setCurrentFilter] = useState("all");

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


  const jobsBySearch = (jobs, searchTerms) => {
    const validSearchTerm = searchTerms.toLowerCase().trim();
    return jobs.filter((job) => job.company.toLowerCase().trim().includes(validSearchTerm))
  }

  const statusObj = jobs.reduce((overallObject, currentVal) => {
    if(!overallObject[currentVal.status]){
        overallObject[currentVal.status] = 0;
    }
    overallObject[currentVal.status] += 1;
    return overallObject;
}, {})

  const handleFilterByStatusChange = (e) => {
    setCurrentFilter(e.target.value);
  }

  const filterJobsByStatus = (jobs, currentFilter) => {
   
      if(currentFilter === "all"){
        return jobs;
      }else {
        return jobs.filter((job) => job.status === currentFilter);
      }
 
    
  }

  const filteredJobs = filterJobsByStatus(
  jobsBySearch(jobs, searchTerms),
  currentFilter
);

  
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
        <section id="jobs_form">

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
       
        <section id="jobs_search_filter">
          <label htmlFor="searchJobs">Search Jobs : </label>
          <input type="text" id="searchJobs" placeholder='Search by company name...' value={searchTerms} onChange={handleSearchChange}/>
          <label htmlFor="filterJobs">Filter jobs by Status : </label>
          <select name="filterJobs" id="filterJobs" value={currentFilter} onChange={handleFilterByStatusChange}>
            <option value="all">All</option>
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </section>
        <section id="jobs_display">
          
          <ul>
            {filteredJobs.length === 0 && <div>No Jobs Found!</div>}
            {filteredJobs.map((job) => {
              return (
                <li key={job.id}>
                  <span>{job.company}</span>
                  <span>{job.position}</span>
                  <span>{job.status}</span>
                  <div class="jobs_cards_buttons_container">
                    <button onClick={() => handleEdit(job.id)} className='jobs_edit_btn'>Edit</button>
                    <button onClick={() => handleDelete(job.id)} className='jobs_delete_btn'>Delete</button>
                  </div>
                  
                </li>
              )
            })}
          </ul>
        </section>
        
        <section id="jobs_analytics">
          <h2>Analytics</h2>
          <div id='jobs_analytics_cards_container'>
          <div>Total Jobs : {jobs.length}</div>
            {Object.entries(statusObj).map((status, index) => {
              return(
                <div key={index}>
                  {status[0]} : {status[1]}
                </div>
              )
            })}
            </div>
        </section>
      </main>
      <footer>

      </footer>
    </div>
  )
}

export default App
