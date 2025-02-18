export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    end_time: Date;
    user_id: number;
}

export interface TaskCreateData {
    task_name: string;
    description: string;
    status: string;
    start_time: string;
    end_time: string;
    tags: string;
    repeat_freq: string;
    remind_time: string;
    colour: string;
    user_id: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}
