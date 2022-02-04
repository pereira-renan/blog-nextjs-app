import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react"

export default async (req, res) => {
  const token = await getProviders({ req })
  res.send(JSON.stringify(token, null, 2))
}
