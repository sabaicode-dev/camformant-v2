import axiosInstance from '@/utils/axios';
import { JobFormData, Job } from '../types/job';
import { API_ENDPOINTS } from '@/utils/const/api-endpoints';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export async function createJob(data: JobFormData): Promise<Job> {
  try {
    const response = await axiosInstance.post<Job>(
      "http://localhost:4000/v1/jobs/job",
      data
    );
     console.log("create job:::",response.data)
    // Return the created Job object from the response
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);

    // Handle or rethrow the error as needed
    throw error;
  }
}

export async function updateJob(id: string, data: JobFormData): Promise<Job> {
  try{

    const response = await axiosInstance.put(`${API_ENDPOINTS.JOBS}/${id}`,data)
    return response.data

  }catch(error){
    console.error("Error creating job:", error);

    // Handle or rethrow the error as needed
    throw error;
  }
}
export async function getJob(id: string): Promise<Job> {
  try {

    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}/${id}`);
    return response.data
  }catch(error){
    console.error("Error creating job:", error);

    // Handle or rethrow the error as needed
    throw error;
  }
}