import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { usr, pwd } = req.body;

  try {
    const response = await fetch('https://demohims.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.api.login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usr, pwd }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}