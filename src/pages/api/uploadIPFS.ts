import type { NextApiRequest, NextApiResponse } from "next"

import { decrypt, listCID, upload } from "@/lib/uploadIPFS"

type Data = {
  cid?: string
  resource?: string
  message?: string
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

    return res.status(200).json({ cid })
  } else if (req.method === "GET") {
    if (req.query.cid != undefined) {
      const encryptedData = await listCID(req.query.cid as string)
      const resource = decrypt(encryptedData)

      return res.status(200).json({ resource })
    }
    return res.status(500).json({ message: "CID not provided" })
  } else {
    return res.status(403).json({ message: "Method not allowed" })
  }
}
