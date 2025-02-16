import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const { name, email, clerkId } = await request.json();

  if (!name || !email || !clerkId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    const response = await sql`
      INSERT INTO users
      (name, email, clerk_id)
      VALUES(${name}, ${email}, ${clerkId})
    `;
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}