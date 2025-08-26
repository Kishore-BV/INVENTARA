import { Metadata } from 'next';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login | Iventara',
  description: 'Sign in to your Iventara account',
};


export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left half: Spline iframe only */}
      <div className="w-1/2 h-screen flex items-center justify-center bg-gray-50">
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-RbwSkoEF7bvgjcB11aWgjFaw/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '500px', minWidth: '300px' }}
          title="Spline Greeting Robot"
        />
      </div>
      {/* Right half: Login form only */}
      <div className="w-1/2 h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
