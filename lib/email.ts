export async function sendAuditEmail(address: string, subject: string, body: string) {
  return {
    to: address,
    subject,
    body,
    status: "queued",
  }
}
