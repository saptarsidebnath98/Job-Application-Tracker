const JobAnalytics = ({jobs}) => {

  const statusObj = jobs.reduce((overallObject, currentVal) => {
    if (!overallObject[currentVal.status]) {
      overallObject[currentVal.status] = 0;
    }
    overallObject[currentVal.status] += 1;
    return overallObject;
  }, {});


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
