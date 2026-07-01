import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  const [editableId, setEditableId] = useState(null);

  const [searchTerms, setSearchTerms] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  const navigate = useNavigate();

  const authHeader = `Bearer ${localStorage.getItem("accessToken")}`;

  const handleFieldChange = (e, setField) => {
    setField(e.target.value);
  }

  const handleSubmit = async () => {
    if (company && position && status) {
      try {
        const response = await fetch("http://localhost:5000/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
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
        toast.success("Job added successfully!");
        setCompany("");
        setPosition("");
        setStatus("Applied");
      } catch (err) {

        toast.error(err.message)
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": authHeader
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
      toast.success("Job deleted successfully!");
    } catch (err) {

      toast.error(err.message)
    }
  }

  const handleEdit = (id) => {
    setEditableId(id)
    const editableJob = jobs.find(job => job.id === id);
    const { company, position, status } = editableJob;
    setCompany(company);
    setPosition(position);
    setStatus(status);
  };

  const handleUpdate = async () => {
    if (company && position && status) {
      try {
        const response = await fetch(`http://localhost:5000/jobs/${editableId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
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
            if (job.id === editableId) {
              return { ...job, ...updatedJob }
            } else {
              return job
            }
          })
        });
        setEditableId(null);
        setCompany("");
        setPosition("");
        setStatus("Applied");
        toast.success("Job updated successfully!");
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerms(value);
  }


  const statusObj = jobs.reduce((overallObject, currentVal) => {
    if (!overallObject[currentVal.status]) {
      overallObject[currentVal.status] = 0;
    }
    overallObject[currentVal.status] += 1;
    return overallObject;
  }, {})

  const handleFilterByStatusChange = (e) => {
    setCurrentFilter(e.target.value);
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully!");
    navigate('/login');
  }

  const fetchJobs = async () => {
    (null);
    setLoading(true);
    const params = new URLSearchParams();

    if (searchTerms.trim()) {
      params.append("search", searchTerms);
    }

    if (currentFilter !== "all") {
      params.append("status", currentFilter);
    }

    const query = params.toString();

    const url = query ? `http://localhost:5000/jobs?${query}` : 'http://localhost:5000/jobs';

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": authHeader
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setJobs(result);
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500)

    return () => clearTimeout(timer);

  }, [searchTerms, currentFilter])


  return (
    <div>
      <header>
        <h1>Job Tracker</h1>
        <button onClick={handleLogout}>Logout</button>
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
          <input type="text" id="searchJobs" placeholder='Search by company name...' value={searchTerms} onChange={handleSearchChange} />
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
            {loading && <div>Loading...</div>}
            {jobs.length === 0 && <div>No Jobs Found!</div>}
            {jobs.map((job) => {
              return (
                <li key={job.id}>
                  <span>{job.company}</span>
                  <span>{job.position}</span>
                  <span>{job.status}</span>
                  <div className="jobs_cards_buttons_container">
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
              return (
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

export default Jobs
