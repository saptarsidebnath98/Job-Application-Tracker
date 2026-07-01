const JobAnalytics = ({jobs, statusObj}) => {
  return (
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
  )
}

export default JobAnalytics
