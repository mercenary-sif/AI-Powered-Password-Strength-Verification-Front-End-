import axios from "axios"

const api = axios.create({
  baseURL: "https://ai-powered-password-strength-api.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
})

export const analyzePassword = (password) => {
  return api.post("/analyze", { password })
}