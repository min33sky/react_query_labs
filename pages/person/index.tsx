import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import React from 'react';
import { useQuery } from 'react-query';

export async function getPerson() {
  const { data } = await axios.get<IPerson>(`/api/person`);
  return data;
}

function PersonPage() {
  const { isLoading, isError, data, error } = useQuery<IPerson, AxiosError>('person', getPerson);

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
      <div>{data?.id}</div>
      <div>{data?.name}</div>
      <div>{data?.age}</div>
    </>
  );
}

export default PersonPage;
