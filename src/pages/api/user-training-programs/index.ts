import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { userTrainingProgramValidationSchema } from 'validationSchema/user-training-programs';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUserTrainingPrograms();
    case 'POST':
      return createUserTrainingProgram();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserTrainingPrograms() {
    const data = await prisma.user_training_program
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'user_training_program'));
    return res.status(200).json(data);
  }

  async function createUserTrainingProgram() {
    await userTrainingProgramValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.user_training_program.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
