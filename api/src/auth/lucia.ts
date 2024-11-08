import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Lucia, TimeSpan } from 'lucia';
import mongoose from 'mongoose';
import { appConfig } from 'src/app.config';

mongoose.connect(appConfig.mongoConStr);

const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users'),
);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
  sessionCookie: {
    attributes: {
      secure: appConfig.nodeEnv === 'production',
    },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
