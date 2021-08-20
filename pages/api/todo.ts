import { ITodo } from 'lib/interfaces/ITodo';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse<ITodo>) => {
  res.status(200).json({ id: 1, message: 'I am a Todo' });
};
