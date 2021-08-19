import { IPerson } from 'lib/interfaces/IPerson';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse<IPerson | Error>) => {
  res.status(200).json({ id: '1', name: 'John Dae', age: 25 });
};
