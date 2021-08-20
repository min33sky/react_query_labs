import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import { GetServerSideProps } from 'next';
import React from 'react';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';

async function fetchPerson() {
  /**
   * ? Next SSR에서 api 호출할 때는 절대 주소를 사용해야 한다.
   */
  const { data } = await axios.get<IPerson>(`http://localhost:3000/api/person`);
  return data;
}

/**
 * ? Hydration 방식으로 react-query SSR 구현
 * @returns
 */
function HydrationPage() {
  const { isLoading, isError, data, error } = useQuery<IPerson, AxiosError>('person', fetchPerson);

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
      <h1>Person</h1>
      <div>{data?.id}</div>
      <div>{data?.name}</div>
      <div>{data?.age}</div>
    </>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('person', fetchPerson);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default HydrationPage;
