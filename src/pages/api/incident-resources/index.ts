import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { incidentResourceValidationSchema } from 'validationSchema/incident-resources';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getIncidentResources();
    case 'POST':
      return createIncidentResource();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIncidentResources() {
    const data = await prisma.incident_resource
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'incident_resource'));
    return res.status(200).json(data);
  }

  async function createIncidentResource() {
    await incidentResourceValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.incident_resource.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
