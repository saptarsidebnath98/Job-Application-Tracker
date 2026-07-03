
const JobList = ({loading, jobs, handleEdit, handleDelete}) => {
  return (
    <section id="jobs_display">
            <h2>Job Applications</h2>
          <div id="jobs_display_column">
            <span className="jobs_display_column_cell">Company Name</span>
            <span className="jobs_display_column_cell">Position</span>
            <span className="jobs_display_column_cell">Application Status</span>
            <span className="jobs_display_column_cell">Controls</span>
          </div>
          <ul>
            {loading && <div>Loading...</div>}
            {jobs.length === 0 && <div>No Jobs Found!</div>}
            {jobs.map((job) => {
              return (
                <li key={job.id}>
                  <span className="jobs_display_cell">{job.company}</span>
                  <span className="jobs_display_cell">{job.position}</span>
                  <span className="jobs_display_cell">{job.status}</span>
                  <div className="jobs_cards_buttons_container">
                    <button onClick={() => handleEdit(job.id)} className='jobs_edit_btn'>Edit</button>
                    <button onClick={() => handleDelete(job.id)} className='jobs_delete_btn'>Delete</button>
                  </div>

                </li>
              )
            })}
          </ul>
        </section>
  )
}

export default JobList
