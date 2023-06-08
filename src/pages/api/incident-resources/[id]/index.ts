import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { incidentResourceValidationSchema } from 'validationSchema/incident-resources';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.incident_resource
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getIncidentResourceById();
    case 'PUT':
      return updateIncidentResourceById();
    case 'DELETE':
      return deleteIncidentResourceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIncidentResourceById() {
    const data = await prisma.incident_resource.findFirst(convertQueryToPrismaUtil(req.query, 'incident_resource'));
    return res.status(200).json(data);
  }

  async function updateIncidentResourceById() {
    await incidentResourceValidationSchema.validate(req.body);
    const data = await prisma.incident_resource.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteIncidentResourceById() {
    const data = await prisma.incident_resource.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
