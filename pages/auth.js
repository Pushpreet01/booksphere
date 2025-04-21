// pages/auth.js
import Head from 'next/head';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  return (
    <>
      <Head>
        <title>Authenticate – BookSphere</title>
      </Head>
      <AuthForm />
    </>
  );
}
