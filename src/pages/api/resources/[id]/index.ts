import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { resourceValidationSchema } from 'validationSchema/resources';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.resource
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getResourceById();
    case 'PUT':
      return updateResourceById();
    case 'DELETE':
      return deleteResourceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResourceById() {
    const data = await prisma.resource.findFirst(convertQueryToPrismaUtil(req.query, 'resource'));
    return res.status(200).json(data);
  }

  async function updateResourceById() {
    await resourceValidationSchema.validate(req.body);
    const data = await prisma.resource.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteResourceById() {
    const data = await prisma.resource.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
