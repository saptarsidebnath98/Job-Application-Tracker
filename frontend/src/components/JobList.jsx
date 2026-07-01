
const JobList = ({loading, jobs, handleEdit, handleDelete}) => {
  return (
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
  )
}

export default JobList
