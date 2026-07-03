import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const JobAnalytics = ({ jobs }) => {

  const statusObj = jobs.reduce((overallObject, currentVal) => {
    if (!overallObject[currentVal.status]) {
      overallObject[currentVal.status] = 0;
    }
    overallObject[currentVal.status] += 1;
    return overallObject;
  }, {});

  const statusArr = Object.entries(statusObj).map(([status, count]) => ({ status, count }));

  const STATUS_COLORS = {
    Applied: "#0042ab",               
    "Interview Scheduled": "#ca8000", 
    Rejected: "#b81717",          
  };

  return (
    <section id="jobs_analytics">
      <h2>Analytics</h2>
      <div id='jobs_analytics_cards_container'>
        <div id="job_analytics_total_jobs">Total Jobs : {jobs.length}</div>
        {Object.entries(statusObj).map((status, index) => {
          return (
            <div key={index} style={{ border : `2px solid ${STATUS_COLORS[status[0]]}` }} >
              {console.log(STATUS_COLORS[status[0]])}
              {status[0]} : {status[1]}
            </div>
          )
        })}
      </div>
      <div id="job_analytics_bar_chart_container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusArr} margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="status" />

            <YAxis allowDecimals={false} />

            <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{
              backgroundColor: "#2d3748",
              border: "1px solid #4a5568",
              borderRadius: "8px",
              color: "#fff",
            }}
              labelStyle={{
                color: "#fff",
              }}

              itemStyle={{
                color: "#f95959",
              }} />

            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              barSize={50}
            >
              {statusArr.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </section>
  )
}

export default JobAnalytics
