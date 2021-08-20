import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import { ITodo } from 'lib/interfaces/ITodo';
import React, { useState } from 'react';
import { useQueries, useQuery, useQueryClient } from 'react-query';
import Link from 'next/link';

export async function fetchPerson() {
  const { data } = await axios.get<IPerson>(`/api/person`);
  return data;
}

export async function fetchTodo() {
  const { data } = await axios.get<ITodo>(`/api/todo`);
  return data;
}

function PersonPage() {
  const [enabled, setEnabled] = useState(true);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    isSuccess: personSuccess,
    data,
    error,
  } = useQuery<IPerson, AxiosError>('person', fetchPerson, {
    enabled,
  });

  const { isSuccess: todoSuccess } = useQuery<ITodo, AxiosError>('todo', fetchTodo, { enabled });

  //* dynamic parallel queries
  const userQueries = useQueries(
    ['1', '2', '3'].map((id) => {
      return {
        queryKey: ['todo', id],
        queryFn: () => id,
        enabled,
      };
    })
  );

  if (personSuccess && todoSuccess && enabled) {
    setEnabled(false); //* 모두 패치되면 enabled 옵션을 false로 바꿔서 리패치를 막는다.
  }

  if (isLoading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Boom Boy: Error is -- {error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <br />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries(); //? 모든 쿼리들의 상태를 stale로 바꾼다. enabled가 false가 아니라면 리패치된다.
        }}
      >
        Invalidate Queries
      </button>
      <br />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries('todo');
        }}
      >
        Invalidate Todo Queries
      </button>
      <br />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries(['todo', '2'], { exact: true });
        }}
      >
        Invalidate Todo-2 Queries
      </button>
      <br />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries('person');
        }}
      >
        Invalidate Person Queries
      </button>
      <br />

      <div>{data?.id}</div>
      <div>{data?.name}</div>
      <div>{data?.age}</div>
      <h1>Person Component</h1>
    </>
  );
}

export default PersonPage;
