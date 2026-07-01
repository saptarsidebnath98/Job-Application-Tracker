const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getJobs = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
           ...getAuthHeader(),
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    
    return await response.json();  
}

export const createJob = async (jobData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       ...getAuthHeader(),
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
};

export const updateJob = async (updatedData, id) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       ...getAuthHeader(),
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return await response.json();
}; 

export const deleteJob = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: {
         ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

    return await response.json();
}

