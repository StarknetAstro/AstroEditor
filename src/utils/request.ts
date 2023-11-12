'use client';
import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
    baseURL: '/',
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(async (config: any) => {
    return config;
});

instance.interceptors.response.use((response: any) => {
    const data = response.data;
    if (data.success === false || data.data?.success === false) {
        throw new Error(data.data?.message || data.message || 'Service Failed');
    }
    return response;
});

export interface ResponseData<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: number;
}

export interface RequestConfig extends AxiosRequestConfig {
    errorHandler?: (e: Error) => void;
}

const request = async <T>(config: RequestConfig): Promise<ResponseData<T>> => {
    try {
        const { data } = await instance<ResponseData<T>>(config);

        console.log(data, 'data')

        return data;
    } catch (e: any) {
        console.log(e);
        if (config.errorHandler) {
            config.errorHandler(e);
        } else {
            console.error(e?.message || 'Service Failed', 'error');
        }
        throw e;
    }
};

export default request;
