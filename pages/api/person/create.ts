import { IPerson } from 'lib/interfaces/IPerson';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse<IPerson>) => {
  const data: IPerson = req.body;
  res.status(200).json(data);
};
