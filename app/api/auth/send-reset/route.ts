import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const host = req.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const resetLink = `${baseUrl}/cambiar-clave?email=${encodeURIComponent(email)}`;

        const { data, error } = await resend.emails.send({
            from: 'ClickAds <onboarding@resend.dev>',
            to: [email],
            subject: 'Recupera tu contraseña en ClickAds',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B5CF6;">¡Hola!</h2>
                    <p>Has solicitado restablecer tu contraseña en <strong>ClickAds</strong>.</p>
                    <p>Haz clic en el siguiente botón para elegir una nueva clave:</p>
                    <a href="${resetLink}" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Cambiar Contraseña</a>
                    <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
                    <p style="font-size: 12px; color: #999;">Equipo ClickAds AI</p>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ message: "Email sent successfully", data });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
