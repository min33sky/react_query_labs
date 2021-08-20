import axios, { AxiosError } from 'axios';
import { IPaginatedTodos } from 'lib/interfaces/IPaginatedTodos';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

async function fetchTodos(pageNumber = 0) {
  const { data } = await axios.get<IPaginatedTodos>(`/api/todo/${pageNumber}`);
  return data;
}

function PaginatedTodoPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { isLoading, isFetching, data, isPreviousData } = useQuery<IPaginatedTodos, AxiosError>(
    ['todos', page],
    () => fetchTodos(page),
    {
      keepPreviousData: true,
    }
  );

  //* Prefetch the next 2 pages on every page load!
  useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery(['todos', page + 1], () => fetchTodos(page + 1));
      queryClient.prefetchQuery(['todos', page + 2], () => fetchTodos(page + 2));
    }
  }, [page, queryClient, data]);

  if (isLoading) {
    return (
      <div>
        <p>Loading.....</p>
      </div>
    );
  }

  return (
    <>
      {data?.todos.map((todo) => (
        <p key={todo.id}>{todo.message}</p>
      ))}
      <span>current Page: {page + 1}</span>
      <br />
      <button
        type="button"
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        type="button"
        onClick={() => {
          if (!isPreviousData && data?.hasMore) {
            setPage((prev) => Math.max(prev + 1));
          }
        }}
        //* fetch중일 때는 이전 데이터가 존재하므로 누를 수 없다.
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching && <span>Loading...</span>}
    </>
  );
}

export default PaginatedTodoPage;
