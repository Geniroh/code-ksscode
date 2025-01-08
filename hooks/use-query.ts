import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

const fetchData = async (url: string, params = {}) => {
  const { data } = await axiosInstance.get(url, { params });
  return data;
};

const postData = async (url: string, payload = {}) => {
  const { data } = await axiosInstance.post(url, payload);
  return data;
};

export const useFetchData = (
  url: string,
  key?: string,
  params = {},
  infiniteOptions = {}
) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => fetchData(url, params),
    ...infiniteOptions,
  });
};

export const usePostData = (url: string, options = {}) => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any) => postData(url, payload),
    ...options,
  });
};
