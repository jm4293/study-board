import crypto from 'crypto';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { getDataSource } from '@/config/data-source';

import { User } from '@/database/entities/User';
import { UserAccount } from '@/database/entities/UserAccount';

type AuthorizedUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  nickname: string | null;
};

// 비밀번호 검증 함수
function verifyPasswordScrypt(stored: string, input: string): boolean {
  if (!stored.includes(':')) {
    return stored === input;
  }
  const [salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(input, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials): Promise<AuthorizedUser | null> => {
        // 이메일과 비밀번호 검증
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 데이터베이스에서 사용자 정보 조회
        const dataSource = await getDataSource();
        const userAccountRepository = dataSource.getRepository(UserAccount);
        const userRepository = dataSource.getRepository(User);

        const account = await userAccountRepository.findOne({
          where: { email: credentials.email },
        });
        if (!account || !account.password || !account.userId) {
          return null;
        }

        // 비밀번호 해시 검증
        const isValidPassword = verifyPasswordScrypt(account.password, credentials.password);
        if (!isValidPassword) {
          return null;
        }

        const user = await userRepository.findOne({
          where: { id: account.userId },
        });
        if (!user) {
          return null;
        }

        return {
          id: String(user.id),
          email: account.email ?? '',
          name: user.nickname ?? user.username,
          username: user.username,
          nickname: user.nickname,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as AuthorizedUser).id;
        token.username = (user as AuthorizedUser).username;
        token.nickname = (user as AuthorizedUser).nickname ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const augmentedSession = session as unknown as {
          user: {
            id?: string;
            username?: string;
            nickname?: string | null;
          };
        } & typeof session;

        augmentedSession.user.id = token.userId as string;
        augmentedSession.user.username = (token.username as string) ?? '';
        augmentedSession.user.nickname = (token.nickname as string | null) ?? null;
        return augmentedSession;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
