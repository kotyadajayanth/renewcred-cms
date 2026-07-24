import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Content'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    getAllContent: builder.query({
      query: () => '/content',
      providesTags: ['Content']
    }),
    getContentById: builder.query({
      query: (id) => `/content/${id}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }]
    }),
    createContent: builder.mutation({
      query: (body) => ({ url: '/content', method: 'POST', body }),
      invalidatesTags: ['Content']
    }),
    updateContent: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/content/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Content']
    }),
    deleteContent: builder.mutation({
      query: (id) => ({ url: `/content/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Content']
    })
  })
});

export const {
  useLoginMutation,
  useGetAllContentQuery,
  useGetContentByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation
} = contentApi;
