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

      console.log("ServiceHelper.fetcher request:", { url: `${this.baseUrl}${url}`, method, headers });

      const response = await axios.request<IApiResponse<T>>({
        url: `${this.baseUrl}${url}`,
        method,
        headers,
        ...Object.fromEntries(Object.entries(options).filter(([k]) => k !== "headers")),
      });

      console.log("ServiceHelper.fetcher response:", response.data);

      return response.data;
    } catch (error: any) {
      // Return backend error if available
      if (axios.isAxiosError(error) && error.response?.data) {
        console.error("ServiceHelper.fetcher AxiosError:", error.response.data);
        return error.response.data as IApiResponse<T>;
      }

      const err: IApiResponse<null> = {
        data: null,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        code: 500,
        success: "error",
      };

      console.error("ServiceHelper.fetcher unknown error:", err);
      return err as IApiResponse<T>;
    }
  }
}


const service = new ServiceHelper();
export default service;


