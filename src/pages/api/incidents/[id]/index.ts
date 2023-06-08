import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { incidentValidationSchema } from 'validationSchema/incidents';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.incident
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getIncidentById();
    case 'PUT':
      return updateIncidentById();
    case 'DELETE':
      return deleteIncidentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIncidentById() {
    const data = await prisma.incident.findFirst(convertQueryToPrismaUtil(req.query, 'incident'));
    return res.status(200).json(data);
  }

  async function updateIncidentById() {
    await incidentValidationSchema.validate(req.body);
    const data = await prisma.incident.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteIncidentById() {
    const data = await prisma.incident.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
