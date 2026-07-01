import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import JobList from '../components/JobList';
import JobAnalytics from '../components/JobAnalytics';
import JobForm from '../components/JobForm';

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

  const handleJobFormSubmit = async () => {
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
        console.error(err);
        toast.error("Something went wrong. Please try again.")
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
      console.error(err);
      toast.error("Something went wrong. Please try again.")
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
        console.error(err);
        toast.error("Something went wrong. Please try again.")
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
      console.error(err);
      toast.error("Something went wrong. Please try again.")
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
        <JobForm company={company} handleFieldChange={handleFieldChange} setCompany={setCompany} position={position} setPosition={setPosition} status={status} setStatus={setStatus} editableId={editableId} handleUpdate={handleUpdate} handleJobFormSubmit={handleJobFormSubmit}/>

        
        <SearchFilter searchTerms={searchTerms} handleSearchChange={handleSearchChange} currentFilter={currentFilter} handleFilterByStatusChange={handleFilterByStatusChange} />

        <JobList loading={loading} jobs={jobs} handleEdit={handleEdit} handleDelete={handleDelete}/>

        <JobAnalytics jobs={jobs} statusObj={statusObj}/>
      </main>
      <footer>

      </footer>
    </div>
  )
}

export default Jobs
