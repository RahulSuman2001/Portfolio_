import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const signup = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
