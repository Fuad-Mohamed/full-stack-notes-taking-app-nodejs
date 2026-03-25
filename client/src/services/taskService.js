function normalizeApiBaseUrl(rawValue) {
  // Default to local backend used by `server/.env` (PORT=5000)
  if (!rawValue) return "http://localhost:5000/api";

  // Ensure no trailing slash so we can safely append paths.
  const trimmed = rawValue.toString().trim().replace(/\/+$/, "");

  if (trimmed.endsWith("/api")) return trimmed;

  return `${trimmed}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

class TaskService {
  async getAllTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  }

  async deleteTask(taskId) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  }
}

export const taskService = new TaskService();
