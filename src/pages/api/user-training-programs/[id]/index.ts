import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userTrainingProgramValidationSchema } from 'validationSchema/user-training-programs';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.user_training_program
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserTrainingProgramById();
    case 'PUT':
      return updateUserTrainingProgramById();
    case 'DELETE':
      return deleteUserTrainingProgramById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserTrainingProgramById() {
    const data = await prisma.user_training_program.findFirst(
      convertQueryToPrismaUtil(req.query, 'user_training_program'),
    );
    return res.status(200).json(data);
  }

  async function updateUserTrainingProgramById() {
    await userTrainingProgramValidationSchema.validate(req.body);
    const data = await prisma.user_training_program.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteUserTrainingProgramById() {
    const data = await prisma.user_training_program.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
