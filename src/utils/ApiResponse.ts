import { Meta } from "../types";

class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public meta?: Meta,
  ) {}
}

export default ApiResponse;
