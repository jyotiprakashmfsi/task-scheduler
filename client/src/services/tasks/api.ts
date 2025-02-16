// import.meta.env.VITE_API_BASE_URL

const api_url = import.meta.env.VITE_API_BASE_URL

interface Task{
    id?: number,
    task_name?: string,
    description: string,
    status: string,
    end_time: string,
    start_time: string,
    tags: string,
    repeat_freq: number,
    remind_time:number,
    colour: string,
    user_id:number
}

export class tasksService {
  static async createTask(data: Task, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async getTasks(id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/all/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      // console.log("API Tasks fetched:", result)
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async getTaskById(id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async updateTask(data: Task, id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async deleteTask(id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async markDone(id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/${id}/mark-done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }

  static async unmarkDone(id: number, jwt: string) {
    try {
      const response = await fetch(`${api_url}/api/tasks/${id}/unmark-done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorisation: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
        console.log(error)
        return error;
    }
  }
}
