import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useNotes = (options = {}) => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await axios.get('/api/notes');
      return res.data.data;
    },
    ...options
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note) => {
      const res = await axios.post('/api/notes', note);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['notes'])
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/notes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['notes'])
  });
};

export const useEditNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }) => {
      const res = await axios.put(`/api/notes/${id}`, note);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['notes'])
  });
};
