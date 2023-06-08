import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { fireDepartmentValidationSchema } from 'validationSchema/fire-departments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFireDepartments();
    case 'POST':
      return createFireDepartment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFireDepartments() {
    const data = await prisma.fire_department
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'fire_department'));
    return res.status(200).json(data);
  }

  async function createFireDepartment() {
    await fireDepartmentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.incident?.length > 0) {
      const create_incident = body.incident;
      body.incident = {
        create: create_incident,
      };
    } else {
      delete body.incident;
    }
    if (body?.resource?.length > 0) {
      const create_resource = body.resource;
      body.resource = {
        create: create_resource,
      };
    } else {
      delete body.resource;
    }
    if (body?.training_program?.length > 0) {
      const create_training_program = body.training_program;
      body.training_program = {
        create: create_training_program,
      };
    } else {
      delete body.training_program;
    }
    const data = await prisma.fire_department.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
