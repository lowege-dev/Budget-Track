import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useGoals = (options = {}) => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await axios.get('/api/goals');
      return res.data.data;
    },
    ...options
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal) => {
      const res = await axios.post('/api/goals', goal);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['goals'])
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await axios.put(`/api/goals/${id}`, updates);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['goals'])
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/goals/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['goals'])
  });
};
