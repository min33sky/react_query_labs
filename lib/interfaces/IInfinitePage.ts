import { ITodo } from 'lib/interfaces/ITodo';

export interface IInfinitePage {
  nextCursor: number | undefined;
  page: {
    todos: ITodo[];
    hasMore: boolean;
  };
}
