import { create } from "@web3-storage/w3up-client"
import crypto from "crypto"
import { algorithm } from "./constants"
import { getBaseURL } from "./web3"

type UploadProps = {
  spaceName: string
  email: `${string}@${string}`
  content: any
}

const key = process.env.ENCRIPTION_KEY || ""

type EncryptDataProps = { iv: string; encryptedData: string }

const encryptData = (data: any): EncryptDataProps => {
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv)

  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") }
}

export const decrypt = (data: EncryptDataProps): string => {
  let iv = Buffer.from(data.iv, "hex")
  let encryptedText = Buffer.from(data.encryptedData, "hex")
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export const upload = async ({ spaceName, email, content }: UploadProps) => {
  const client = await create()
  const space = await client.createSpace(spaceName)
  const myAccount = await client.login(email)

  await myAccount.provision(space.did())
  await space.createRecovery(myAccount.did())
  await space.save()
  await client.setCurrentSpace(space.did())

  const { iv, encryptedData } = encryptData(JSON.stringify(content))

  const dataToStore = JSON.stringify({ iv, encryptedData })
  // const file = new File(
  //   [Buffer.from(dataToStore, "utf-8")],
  //   "encrypted_data.json"
  // )
  // const blob = new Blob([file], { type: "text/plain" })

  const blob = new Blob([dataToStore], { type: "application/json" })
  const cid = await client.uploadFile(blob)
  console.log(JSON.parse(decrypt({ iv, encryptedData })))
  return cid.toString()
}

export const listCID = async (cid: string) => {
  const jsonContent = await fetch(`${getBaseURL(cid)}`)
  return await jsonContent.json()
}
