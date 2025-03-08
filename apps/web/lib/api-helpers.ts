import type { JobsQueryParams } from "../app/api/jobs/route";

export async function fetchJobs(params?: Partial<JobsQueryParams>) {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const response = await fetch(`/api/jobs${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

export async function fetchJobById(id: string) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch job details');
  }
  
  return response.json();
}
