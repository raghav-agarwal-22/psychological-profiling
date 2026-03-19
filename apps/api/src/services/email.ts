import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'noreply@innermind.app'
const PRODUCT_NAME = 'Innermind'
const TAGLINE = 'Understand yourself deeply.'

function buildMagicLinkHtml(magicLinkUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${PRODUCT_NAME} sign-in link</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);overflow:hidden;max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="background:#0f0f0f;padding:32px 40px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">${PRODUCT_NAME}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#888888;">${TAGLINE}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;color:#111111;letter-spacing:-0.3px;">Sign in to ${PRODUCT_NAME}</h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#555555;">
                Click the button below to sign in. This link expires in <strong>15 minutes</strong> and can only be used once.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#0f0f0f;">
                    <a href="${magicLinkUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">Sign in →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;font-size:13px;color:#999999;">
                Or copy and paste this URL into your browser:<br>
                <a href="${magicLinkUrl}" style="color:#555555;word-break:break-all;">${magicLinkUrl}</a>
              </p>
              <hr style="margin:32px 0;border:none;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;">
                If you didn't request this email, you can safely ignore it. Someone may have typed your email by mistake.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildMagicLinkText(magicLinkUrl: string): string {
  return `${PRODUCT_NAME} — ${TAGLINE}

Sign in to ${PRODUCT_NAME}

Click the link below to sign in. This link expires in 15 minutes and can only be used once.

${magicLinkUrl}

If you didn't request this email, you can safely ignore it.
`
}

export async function sendMagicLink(email: string, magicLinkUrl: string): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — magic link for ${email}: ${magicLinkUrl}`)
    return
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${PRODUCT_NAME} sign-in link`,
      html: buildMagicLinkHtml(magicLinkUrl),
      text: buildMagicLinkText(magicLinkUrl),
    })
  } catch (err) {
    // Log failure but don't surface to caller — avoid leaking email existence
    console.error('[email] Failed to send magic link via Resend:', err)
    console.info(`[email] Fallback — magic link for ${email}: ${magicLinkUrl}`)
  }
}
