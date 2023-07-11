import { AxiosError } from "axios";

export type ErrorResponse = AxiosError<{
  error: {
    status_code: number,
    message: string,
    details: {
        detail: {
            message?: string
            remedies?: string[]
            extra?: any
        }
    }
  }
}>;
