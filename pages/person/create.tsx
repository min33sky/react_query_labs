import axios, { AxiosError } from 'axios';
import { IPerson } from 'lib/interfaces/IPerson';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPerson } from '.';

interface ICreatePersonParams {
  id: string;
  name: string;
  age: number;
}

interface IContext {
  id: string;
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

  const { data: queryData } = useQuery<IPerson, AxiosError>('person', getPerson, { enabled });
  const mutation = useMutation<IPerson, AxiosError, ICreatePersonParams, IContext | undefined>(
    async ({ id, name, age }) => createPerson({ id, name, age }),
    {
      // before mutation
      onMutate: (variables: ICreatePersonParams) => {
        console.log('mutation variables', variables);
        return {
          id: '777', //? context에서 사용가능한 값(예: 원본 값을 저장할 때 사용)
        };
      },
      // on success of mutation
      onSuccess: (
        data: IPerson,
        _variables: ICreatePersonParams,
        _context: IContext | undefined
      ) => {
        queryClient.invalidateQueries('person'); //? person 키를 무효화해서 리패치를 한다.
        return console.log('mutation data', data);
      },

      // if mutation errors
      onError: (
        error: AxiosError,
        _variables: ICreatePersonParams,
        context: IContext | undefined
      ) => {
        console.log('error: ', error.message);
        return console.log(`rolling back optimistic update with id: ${context?.id}`);
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
