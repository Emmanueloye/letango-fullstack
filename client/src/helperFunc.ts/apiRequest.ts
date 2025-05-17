import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';

export const customFetch = axios.create({
  baseURL: '/api/v1',
});

export const queryClient = new QueryClient();

/**
 * This function extract form data from a form using the name attribute set on the form inputs.
 * @param request
 * @returns Object of key value pair containing the form body
 */
export const extractFormData = async (request: Request) => {
  const formData = await request.formData();
  return Object.fromEntries(formData);
};

/**
 * This function extract the query paramaters in form of object.
 * @param request
 * @returns Object of key value pair containing the query params in url.
 */
export const extractParams = (request: Request) => {
  return Object.fromEntries([...new URL(request.url).searchParams.entries()]);
};

type PostInput<T> = {
  url: string;
  data: T;
  redirectTo?: string;
  setToast?: boolean;
  toastStyles?: string;
  invalidate?: string[];
};

type FormDataValue = unknown;

interface FormData {
  [key: string]: FormDataValue;
}

/**
 * This function fetch data from the server and does not throw error to trigger page errorboundary.
 * @param object url, params -  fetchOnlyData accepts url and query paramaters (optional)
 * @returns result of the data fetched
 */
export const fetchOnlyData = async ({
  url,
  params,
}: {
  url: string;
  params?: FormData;
}) => {
  try {
    const result = await customFetch.get(url, { params });
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};

/**
 * This function fetch data from the server but throw error to trigger page errorboundary.
 * @param object url, params -  fetchOnlyData accepts url and query paramaters (optional)
 * @returns result of the data fetched
 */
export const getData = async ({
  url,
  params,
}: {
  url: string;
  params?: Record<string, string | number | boolean>;
}) => {
  try {
    const result = await customFetch.get(url, { params });
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

/**
 *The function is to send a post request to the server.
 * @param Object - url - url to fetch from, data - data to be sent to the server, redirectTo - client side url to redirect to if successful, setToast - to display success message, toastStyles - style the toast, invalidate - set the query key for any query to be invalidated.
 * @returns  response from the server for the posted data.
 */
export const postData = async <T>({
  url,
  data,
  redirectTo,
  setToast,
  toastStyles,
  invalidate,
}: PostInput<T>) => {
  try {
    const result = await customFetch.post(url, data);

    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: invalidate });
    }
    if (setToast) {
      toast.success(result?.data?.message, {
        className: toastStyles,
      });
    }
    if (redirectTo) {
      return redirect(redirectTo);
    }
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

/**
 *The function is to send patch request to the server
 * @param Object - url - url to fetch from, data - data to be sent to the server, redirectTo - client side url to redirect to if successful, setToast - to display success message, toastStyles - style the toast, invalidate - set the query key for any query to be invalidated.
 * @returns  response from the server for the posted data.
 */
export const patchData = async <T>({
  url,
  data,
  redirectTo,
  setToast,
  toastStyles,
  invalidate,
}: PostInput<T>) => {
  try {
    const result = await customFetch.patch(url, data);

    if (invalidate) {
      invalidate.forEach((item) =>
        queryClient.invalidateQueries({ queryKey: [item] })
      );
    }
    if (setToast) {
      toast.success(result?.data?.message, {
        className: toastStyles,
      });
    }
    if (redirectTo) {
      return redirect(redirectTo);
    }
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

/**
 *The function is send a delete request to the server for a resource.
 * @param Object - url: the server url the request is going, redirectTo: client side url where we want to redirect to on success, invalidate: set query keys for query to be invalidated.
 * @returns
 */
export const deleteData = async ({
  url,
  redirectTo,
  invalidate,
}: {
  url: string;
  redirectTo?: string;
  invalidate?: string[];
}) => {
  try {
    const resp = await customFetch.delete(url);
    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: invalidate });
    }
    if (redirectTo) redirect(redirectTo);

    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};
