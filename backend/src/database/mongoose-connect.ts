import { connection, connections, connect } from 'mongoose';

const mongo: string =
  process.env.MONGO || 'mongodb://admin:admin@localhost:27017/faturaflow?authSource=admin';

export async function mongoConnect() {
  connection
    .on('error', (error) => {
      console.log('ERROR: Connection to MongoDB failed', error);
    })
    .on('close', () => {
      console.log('Connection to MongoDB ended');
      process.exit(1);
    })
    .once('open', () => {
      const infos = connections;
      infos.map((info) =>
        console.log(`Connected to ${info.host}:${info.port}/${info.name} mongo Database`),
      );
    });

  await connect(mongo);
}

export function mongoDisconnect() {
  return connection.close();
}
