import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { useQuery } from 'react-query';

async function getPersonById(id: string | string[] | undefined) {
  const { data } = await axios.get<IPerson>(`/api/person/${id}`);
  return data;
}

function PersonIdPage() {
  const {
    query: { id },
  } = useRouter();

  const { isLoading, isError, error, data } = useQuery<IPerson, AxiosError>(['person', id], () =>
    getPersonById(id)
  );

  if (isLoading) {
    return (
      <div>
        <p>Loading.....</p>
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
      <div>{data?.id}</div>
      <div>{data?.name}</div>
      <div>{data?.age}</div>
    </>
  );
}

export default PersonIdPage;
