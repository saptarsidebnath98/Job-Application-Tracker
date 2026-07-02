import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const JobAnalytics = ({jobs}) => {

  const statusObj = jobs.reduce((overallObject, currentVal) => {
    if (!overallObject[currentVal.status]) {
      overallObject[currentVal.status] = 0;
    }
    overallObject[currentVal.status] += 1;
    return overallObject;
  }, {});

  const statusArr = Object.entries(statusObj).map(([status, count]) => ({status, count}));

  console.log(statusArr);
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
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusArr}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" fill="#f95959" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
        </section>
  )
}

export default JobAnalytics
