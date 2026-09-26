import { execSync } from "child_process";

const CONTAINER = "portfolio-mongo-test";

function sh(cmd: string) {
  return execSync(cmd, { stdio: "pipe" }).toString();
}

export default async function globalSetup() {
  try {
    sh(`docker rm -f ${CONTAINER}`);
  } catch {
    // no previous container, ignore
  }

  sh(
    `docker run -d --name ${CONTAINER} -p 27017:27017 mongo:8.0 --replSet rs0 --bind_ip_all`
  );

  // wait for mongod to accept connections before initiating the replica set
  for (let i = 0; i < 20; i++) {
    try {
      sh(`docker exec ${CONTAINER} mongosh --quiet --eval "db.runCommand({ ping: 1 })"`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  sh(
    `docker exec ${CONTAINER} mongosh --quiet --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})"`
  );

  // wait until the node becomes PRIMARY
  for (let i = 0; i < 20; i++) {
    try {
      const out = sh(
        `docker exec ${CONTAINER} mongosh --quiet --eval "rs.status().myState"`
      );
      if (out.trim() === "1") break;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  process.env.DATABASE_URL = "mongodb://localhost:27017/portfolio_test?replicaSet=rs0";

  sh(
    `npx --yes -p prisma@6.14.0 -- prisma db push --skip-generate --accept-data-loss`
  );

  sh(`npx tsx tests/seed.ts`);
}
