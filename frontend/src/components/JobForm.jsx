const JobForm = ({company, handleFieldChange, setCompany, position, setPosition, status, setStatus, editableId, handleUpdate, handleJobFormSubmit}) => {
  return (
    <section id="jobs_form">
          <h2>Jobs Form</h2>
          <div id="jobs_form_content">
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
          {editableId ? <button className="formUpdateBtn" onClick={handleUpdate}>Update</button> : <button className="formSubmitBtn" onClick={handleJobFormSubmit}>submit</button>}
          </div>
        </section>
  )
}

export default JobForm
