import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainingProgramValidationSchema } from 'validationSchema/training-programs';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainingPrograms();
    case 'POST':
      return createTrainingProgram();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainingPrograms() {
    const data = await prisma.training_program
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'training_program'));
    return res.status(200).json(data);
  }

  async function createTrainingProgram() {
    await trainingProgramValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.user_training_program?.length > 0) {
      const create_user_training_program = body.user_training_program;
      body.user_training_program = {
        create: create_user_training_program,
      };
    } else {
      delete body.user_training_program;
    }
    const data = await prisma.training_program.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
