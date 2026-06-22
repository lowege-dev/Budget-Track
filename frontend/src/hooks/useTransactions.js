import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API Functions
const fetchTransactions = async () => {
  const { data } = await axios.get('/api/transactions');
  return data.data; // Return the inner data array
};

const addTransaction = async (newTransaction) => {
  const { data } = await axios.post('/api/transactions', newTransaction);
  return data.data;
};

const deleteTransaction = async (id) => {
  await axios.delete(`/api/transactions/${id}`);
  return id;
};

// Custom Hooks for strict data fetching rules
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time per rule requirements
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
