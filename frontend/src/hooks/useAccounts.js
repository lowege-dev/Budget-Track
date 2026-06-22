import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchAccounts = async () => {
  const { data } = await axios.get('/api/accounts');
  return data.data;
};

const addAccount = async (newAccount) => {
  const { data } = await axios.post('/api/accounts', newAccount);
  return data.data;
};

const deleteAccount = async (id) => {
  await axios.delete(`/api/accounts/${id}`);
  return id;
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
