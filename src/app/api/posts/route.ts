// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: String(search) } },
        { author: { name: { contains: String(search) } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  res.status(200).json(posts);
}
