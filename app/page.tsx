import { db } from "./lib/db"; 

export default async function Home() {
  const users = await db.user.findMany();

  return (
    <main>
      <h1>Users1</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}