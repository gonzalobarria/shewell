import type { NextApiRequest, NextApiResponse } from "next"

import { upload } from "@/lib/uploadIPFS"

type Data = {
  cid: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let cid = ""

  if (req.method === "POST") {
    cid = await upload({
      spaceName: process.env.IPFS_SPACE || "test",
      email: `${process.env.IPFS_EMAIL_USER}@${process.env.IPFS_EMAIL_HOST}`,
      content: req.body,
    })
  }

  res.status(200).json({ cid })
}
