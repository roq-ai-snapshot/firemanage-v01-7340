import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { incidentValidationSchema } from 'validationSchema/incidents';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getIncidents();
    case 'POST':
      return createIncident();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIncidents() {
    const data = await prisma.incident
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'incident'));
    return res.status(200).json(data);
  }

  async function createIncident() {
    await incidentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.incident_resource?.length > 0) {
      const create_incident_resource = body.incident_resource;
      body.incident_resource = {
        create: create_incident_resource,
      };
    } else {
      delete body.incident_resource;
    }
    const data = await prisma.incident.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
