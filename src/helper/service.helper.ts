import axios, { AxiosRequestConfig, Method } from "axios";
import { IApiResponse } from "@/interface/interface";

class ServiceHelper {
  private readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  private readonly secret = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

  constructor() {
    if (!this.baseUrl || !this.secret) {
      throw new Error("Base URL or Secret is not defined in environment variables.");
    }
  }

  async fetcher<T>(
    url: string,
    method: Method = "GET",
    options: AxiosRequestConfig = {}
  ): Promise<IApiResponse<T>> {
    try {
      // Merge headers safely: options.headers do not override secret
      const headers = {
        "Content-Type": "application/json",
        "secret": this.secret, // match your middleware header name
        ...(options.headers || {}),
      };

      const response = await axios.request<IApiResponse<T>>({
        url: `${this.baseUrl}${url}`,
        method,
        headers,
        ...Object.fromEntries(Object.entries(options).filter(([k]) => k !== "headers")),
        withCredentials: true, // include cookies
      });

      console.log("ServiceHelper.fetcher response:", response);

      return response.data;
    } catch (error: any) {
      // Return backend error if available
      if (axios.isAxiosError(error)) {
        // If server responded with data, return it
        if (error.response?.data) {
          console.error("ServiceHelper.fetcher AxiosError (response.data):", error.response.data);
          return error.response.data as IApiResponse<T>;
        }

        // Network / CORS / no response case — log full axios error for debugging
        console.error("ServiceHelper.fetcher AxiosError (no response). message:", error.message);
        console.error("Axios error details:", {
          message: error.message,
          code: error.code,
          config: error.config && {
            url: error.config.url,
            method: error.config.method,
            headers: error.config.headers,
          },
        });
      } else {
        // Non-axios error
        console.error("ServiceHelper.fetcher non-Axios error:", error);
      }

      const err: IApiResponse<null> = {
        data: null,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        code: 500,
        status: "error",
      };

      console.error("ServiceHelper.fetcher returning error object:", err);
      return err as IApiResponse<T>;
    }
  }
}


const service = new ServiceHelper();
export default service;


