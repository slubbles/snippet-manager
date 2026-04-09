import { auth } from "./auth"
import { headers } from "next/headers"

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null
  return session.user
}

export async function requireUser() {
  const user = await getUser()
  if (!user) throw new Error("Unauthorized")
  return user
}
