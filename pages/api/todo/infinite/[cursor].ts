import { ITodo } from 'lib/interfaces/ITodo';
import { IInfinitePage } from 'lib/interfaces/IInfinitePage';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse<IInfinitePage | Error>) => {
  const {
    query: { cursor },
  } = req;

  const PER_PAGE = 30;
  const LAST_PAGE = 4;

  if (typeof cursor === 'string') {
    console.log(`getting infinite page cursor: ${cursor}`);
    const returnTodos: ITodo[] = [];
    const numberCursor = parseInt(cursor);
    const nums = numberCursor * PER_PAGE;
    for (let i = nums; i < nums + PER_PAGE; i += 1) {
      const resultTodo: ITodo = {
        id: i,
        message: `Todo Number: ${i}`,
      };
      returnTodos.push(resultTodo);
    }

    const testPage: IInfinitePage = {
      nextCursor: numberCursor + 1 < LAST_PAGE ? numberCursor + 1 : undefined,
      page: {
        todos: returnTodos,
        hasMore: numberCursor !== LAST_PAGE,
      },
    };

    res.status(200).json(testPage);
  } else {
    res.status(400).json(new Error('id is not of correct type'));
  }
};
