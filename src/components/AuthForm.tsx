
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistInput from '@/components/BrutalistInput';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (error) {
      // Error handling is done in the useAuth hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutalist-container">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">GRYT</h1>
        <p className="text-center text-lg font-bold mt-2">
          UNLOCK THE BEST VERSION OF YOU
        </p>
      </div>

      <div className="brutalist-section">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-6 text-center">
            {isLogin ? 'WELCOME BACK' : 'JOIN THE GRYT COMMUNITY'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <BrutalistInput
                value={fullName}
                onChange={setFullName}
                label="FULL NAME"
                placeholder="Enter your full name"
                required
              />
            )}

            <BrutalistInput
              value={email}
              onChange={setEmail}
              label="EMAIL"
              placeholder="Enter your email"
              required
            />

            <BrutalistInput
              value={password}
              onChange={setPassword}
              label="PASSWORD"
              placeholder="Enter your password"
              required
            />

            <BrutalistButton
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'LOADING...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
            </BrutalistButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold underline hover:text-brutalist-green transition-colors"
            >
              {isLogin 
                ? "Don't have an account? SIGN UP" 
                : "Already have an account? LOG IN"
              }
            </button>
          </div>

          {/* Login Tips */}
          <div className="mt-6 p-4 border-2 border-brutalist-black bg-gray-50">
            <h3 className="font-bold mb-2">💡 QUICK TIPS:</h3>
            <ul className="text-sm space-y-1">
              <li>• No email verification required</li>
              <li>• Simple password requirements</li>
            </ul>
          </div>
        </BrutalistCard>
      </div>
    </div>
  );
};
