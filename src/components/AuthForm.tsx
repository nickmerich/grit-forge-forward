
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
          BECOME THE BEST VERSION OF YOU
        </p>
      </div>

      <div className="brutalist-section">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-6 text-center">
            {isLogin ? 'WELCOME BACK' : 'JOIN THE GRYT COMMUNITY'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-2">FULL NAME</label>
                <BrutalistInput
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2">EMAIL</label>
              <BrutalistInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">PASSWORD</label>
              <BrutalistInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

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
              className="font-bold underline"
            >
              {isLogin 
                ? "Don't have an account? SIGN UP" 
                : "Already have an account? LOG IN"
              }
            </button>
          </div>
        </BrutalistCard>
      </div>
    </div>
  );
};
