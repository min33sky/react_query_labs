import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchPerson } from '.';

interface ICreatePersonParams {
  id: string;
  name: string;
  age: number;
}

/**
 * ? useMutation Hook의 options에서 사용하는 타입
 * - 예) Optimistic UI를 구현할 때 사용한다. (mutation하기 직전 값을 저장하는 용도)
 */
interface IContext {
  previousPerson?: IPerson | undefined;
}

async function createPerson({ id, name, age }: ICreatePersonParams): Promise<IPerson> {
  const { data } = await axios.post<IPerson>(`/api/person/create`, {
    id,
    name,
    age,
  });

  return data;
}

function CreatePage() {
  const queryClient = useQueryClient();

  const [enabled, setEnabled] = useState(false);

  const { data: queryData } = useQuery<IPerson, AxiosError>('person', fetchPerson, { enabled });
  const mutation = useMutation<IPerson, AxiosError, ICreatePersonParams, IContext | undefined>(
    async ({ id, name, age }) => createPerson({ id, name, age }),
    {
      // before mutation
      onMutate: async (variables: ICreatePersonParams) => {
        //* 진행중인 피래치를 취소한다. (Optimistic update에 덮어쓰기 방지)
        await queryClient.cancelQueries('person');

        //* 이전 값의 snapshot (rollback 대비 데이터)
        const previousPerson: IPerson | undefined = queryClient.getQueryData('person');

        const newPerson: IPerson = {
          id: '123',
          age: 200,
          name: 'Tl Dddack',
        };

        //* Optimistically Update
        queryClient.setQueryData('person', newPerson);

        //* snapshot과 함께 context 객체를 리턴
        return {
          previousPerson,
        };
      },
      // on success of mutation
      onSuccess: (
        data: IPerson,
        _variables: ICreatePersonParams,
        _context: IContext | undefined
      ) => {
        queryClient.invalidateQueries('person'); //? key가 person인 쿼리를 무효화 (stale 상태로 만든다.)
        return console.log('mutation data', data);
      },

      // if mutation errors
      onError: (
        error: AxiosError,
        _variables: ICreatePersonParams,
        context: IContext | undefined
      ) => {
        console.log('error: ', error.message);
        queryClient.setQueryData('person', context?.previousPerson); //* snapshot으로 rollback!
        return console.log(
          `rolling back optimistic update with id: ${context?.previousPerson?.id}`
        );
      },

      // no matter if error or success run me
      onSettled: (
        _data: IPerson | undefined,
        _error: AxiosError | null,
        _variables: ICreatePersonParams | undefined,
        _context: IContext | undefined
      ) => {
        return console.log(`complete mutation`);
      },
    }
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: {
        value: string;
      };
      age: {
        value: number;
      };
    };

    const id = '1';
    const name = target.name.value;
    const age = target.age.value;
    mutation.mutate({ id, name, age });
  };

  return (
    <>
      {mutation.isLoading ? (
        <p>Adding todo</p>
      ) : (
        <>
          {mutation.isError ? <div>An error occurred: {mutation.error?.message}</div> : null}
          {mutation.isSuccess ? (
            <div>
              Todo added! Person name is {mutation.data?.name} and he is {mutation.data?.age}
            </div>
          ) : null}{' '}
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setEnabled(!enabled);
          queryClient.invalidateQueries('person');
        }}
      >
        Invalidate Cache
      </button>

      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name:</label>
        <br />
        <input type="text" id="name" name="name" />
        <br />
        <label htmlFor="age">Age:</label>
        <br />
        <input type="number" id="age" name="age" />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>

      {queryData && (
        <>
          <div>{queryData?.id}</div>
          <div>{queryData?.name}</div>
          <div>{queryData?.age}</div>
        </>
      )}
    </>
  );
}

export default CreatePage;
