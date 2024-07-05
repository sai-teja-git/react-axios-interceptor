import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import apiService from "../services/api.service";
import globalRouter from "../services/globalRouter.service";
import encryptionService from "../services/encryption.service";

/**
 * The `interface IAxiosReqConfig` is extending the `InternalAxiosRequestConfig` interface from the
 * Axios library. By doing this, `IAxiosReqConfig` inherits all the properties and methods defined in
 * `InternalAxiosRequestConfig` and can also add additional properties specific to your application's
 * needs. In this case, the `IAxiosReqConfig` interface includes an additional property
 * `retryingAfterTokenRefresh` which is used to track whether a request is being retried after
 * refreshing the access token. This extension allows you to define a more specific request
 * configuration interface tailored to your application's requirements.
 */
interface IAxiosReqConfig extends InternalAxiosRequestConfig {
    retryingAfterTokenRefresh?: boolean
}

/**
 * The `interface IFailedRequests` is defining a structure for objects that represent failed requests.
 */
interface IFailedRequests {
    resolve: (value: AxiosResponse | any) => void;
    reject: (value: AxiosError) => void;
    config: AxiosRequestConfig;
    error: AxiosError;
    apiInstance: AxiosInstance
}

/**
 * This variable is used as a flag to identify whether the process of refreshing the access token is currently in progress or 
 * not. It helps in preventing multiple simultaneous requests to refresh the token by keeping track of 
 * the state of the refresh token process.
 */
let refreshTokenInprogress = false;
/**
 *  This array will be used to store information about failed requests,
 * such as the request configuration, error details, and the Axios instance associated with the
 * request. This allows the code to keep track of failed requests that need to be retried after
 * refreshing the access token.
 */
let failedRequests: IFailedRequests[] = [];

/**
 * The function `refreshToken` asynchronously refreshes a token using an API service and returns the
 * updated token.
 * @returns The `refreshToken` function returns a Promise that resolves to a string value, which is the
 * token retrieved from the API service after refreshing the token.
 */
const refreshToken = async (): Promise<string> => {
    return await apiService.refreshToken().then((res) => {
        const data = res.data?.data;
        return data.token;
    }).catch(() => {
        throw new Error("Token Update Failed");
    });
};

/**
 * The `redirect` function displays an error message using a toast notification and then navigates to
 * the home page if a global router is available.
 * @param {string} message - The `message` parameter is a string that contains the message to be
 * displayed in a toast notification when the `redirect` function is called.
 * @param {string} id - The `id` parameter in the `redirect` function is a string that represents the
 * unique identifier associated with the toast message being displayed. It is used to identify and
 * manage the toast message, allowing for specific actions to be taken on it, such as updating or
 * removing it.
 * @param [duration=2000] - The `duration` parameter in the `redirect` function specifies the time
 * duration (in milliseconds) for which the error message will be displayed using the `toast.error`
 * function before the redirection occurs. By default, the duration is set to 2000 milliseconds (2
 * seconds) if not explicitly provided when
 */
const redirect = (message: string, id: string, duration = 2000) => {
    refreshTokenInprogress = false;
    toast.error(message, { duration, id });
    if (globalRouter.navigate) {
        globalRouter.navigate("/")
    }
}

/**
 * The onRequest function processes Axios request configurations, adding authorization headers and
 * encrypting data if specified.
 * @param {IAxiosReqConfig} config - The `config` parameter in the `onRequest` function is an object of
 * type `IAxiosReqConfig`. It likely contains various properties related to an Axios request
 * configuration, such as `url`, `data`, `headers`, and `retryingAfterTokenRefresh`. The function
 * performs certain operations
 * @returns The `onRequest` function is returning the `config` object after potentially modifying it
 * based on certain conditions. The modifications include adding an Authorization header with a Bearer
 * token retrieved from sessionStorage, and potentially encrypting the data in the request body if the
 * condition `import.meta.env.VITE_ENCRYPTION === "true"` is met.
 */
const onRequest = (config: IAxiosReqConfig) => {

    const encrypt = () => {
        if (config.data && !config.retryingAfterTokenRefresh) {
            config.data = { data: encryptionService.encryptData(config.data) } // you can send plain encrypted string here
        }
    }

    if (!config.url?.endsWith("/login")) {
        config.headers.Authorization = `Bearer ${sessionStorage.getItem("access_token")}`
        if (import.meta.env.VITE_ENCRYPTION === "true") {
            encrypt()
        }
    }
    return config;
}

/**
 * The function onRequestError handles Axios errors by returning a rejected Promise with the error.
 * @param {AxiosError} error - The `error` parameter in the `onRequestError` function is of type
 * `AxiosError`, which is an error object specific to Axios, a popular JavaScript library for making
 * HTTP requests. This error object contains information about the error that occurred during the HTTP
 * request, such as the status code,
 * @returns A Promise that rejects with the provided AxiosError.
 */
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
}

/**
 * The function `onResponse` decrypts response data if encryption is enabled and the request is not a
 * login request.
 * @param {AxiosResponse} response - The `response` parameter in the `onResponse` function is of type
 * `AxiosResponse`, which represents the response data returned from an Axios HTTP request. It contains
 * various properties such as `data`, `status`, `headers`, `config`, etc., that provide information
 * about the response from the
 * @returns The `onResponse` function is returning the `response` object after potentially decrypting
 * the data in the response based on certain conditions.
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
    const config = response.config
    const decrypt = () => {
        if (import.meta.env.VITE_ENCRYPTION === "true") {
            if (response.data?.data) {
                response.data.data = encryptionService.decryptData(response.data.data)
            }
        }
    }
    if (!config.url?.endsWith("/login")) {
        decrypt()
    }
    return response;
}

/**
 * The function `onResponseError` handles error responses in Axios requests, including refreshing
 * tokens and redirecting for session expiration.
 * @param {AxiosError} error - The `error` parameter in the `onResponseError` function is an AxiosError
 * object, which represents an error that occurred during an HTTP request using Axios. It contains
 * information about the error response, request configuration, and other relevant data related to the
 * error.
 * @param {AxiosInstance} axiosInstance - `axiosInstance` is an instance of Axios, which is a popular
 * JavaScript library used to make HTTP requests from the browser or Node.js. It provides a simple API
 * for performing asynchronous HTTP requests. In the provided code snippet, `axiosInstance` is passed
 * as a parameter to the `onResponseError
 * @returns The `onResponseError` function returns a Promise that resolves to an AxiosError.
 */
const onResponseError = async (error: AxiosError, axiosInstance: AxiosInstance): Promise<AxiosError> => {
    const originalRequest: any = error.config
    if (error.response?.status === 440) {
        redirect("Session Expired", "session-expired")
    } else if (error.response?.status === 401) {
        originalRequest.retryingAfterTokenRefresh = true
        try {
            if (refreshTokenInprogress) {
                return new Promise((resolve, reject) => {
                    failedRequests.push({
                        resolve,
                        reject,
                        config: originalRequest,
                        error: error,
                        apiInstance: axiosInstance
                    });
                });
            }

            refreshTokenInprogress = true;
            const token = await refreshToken()
            sessionStorage.setItem("access_token", token)
            failedRequests.forEach(({ resolve, reject, config, apiInstance }) => {
                apiInstance(config)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
            failedRequests = [];
            refreshTokenInprogress = false;
        } catch {
            failedRequests.forEach(({ reject, error }) => reject(error));
            failedRequests = [];
            refreshTokenInprogress = false;
            redirect("Session Expired", "session-expired")
            return Promise.reject();
        }
        return axiosInstance(originalRequest)
    }
    return Promise.reject();
}

/**
 * The function `setupInterceptorsTo` sets up request and response interceptors for an Axios instance.
 * @param {AxiosInstance} axiosInstance - `axiosInstance` is an instance of Axios, which is a popular
 * JavaScript library used for making HTTP requests from the browser or Node.js. In the provided
 * function `setupInterceptorsTo`, this instance is passed as a parameter to set up request and
 * response interceptors.
 * @returns The function `setupInterceptorsTo` is returning the `axiosInstance` after setting up
 * request and response interceptors on it.
 */
export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, (error) => onResponseError(error, axiosInstance));
    return axiosInstance;
}