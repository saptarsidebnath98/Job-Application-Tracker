const SearchFilter = ({searchTerms, handleSearchChange, currentFilter, handleFilterByStatusChange}) => {
  return (
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
  )
}

export default SearchFilter
