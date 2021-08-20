import { ITodo } from 'lib/interfaces/ITodo';
import { IPaginatedTodos } from 'lib/interfaces/IPaginatedTodos';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse<IPaginatedTodos | Error>) => {
  const {
    query: { page },
  } = req;

  const PER_PAGE = 5;

  if (typeof page === 'string') {
    console.log(`getting page number: ${page}`);
    const returnTodos: ITodo[] = [];
    const nums = parseInt(page) * PER_PAGE; //? PER_PAGE개씩 보여줄 것 + 시작 인덱스로 사용
    for (let i = nums; i < nums + PER_PAGE; i += 1) {
      const returnTodo: ITodo = {
        id: i,
        message: `Todo number: ${i}`,
      };
      returnTodos.push(returnTodo);
    }

    res.status(200).json({ todos: returnTodos, hasMore: page !== '4' });
  } else {
    res.status(400).json(new Error('id is not of correct type'));
  }
};
