import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would authenticate with a backend
        console.log('Logging in with:', { email, password });
        navigate('/dashboard');
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would register with a backend
        console.log('Registering with:', { name, email, university, password });
        navigate('/dashboard');
    };

    const toggleForm = () => setIsRegister(!isRegister);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-branding">
                    <div className="login-logo">
                        <h1>Exchange Connect</h1>
                        {/* Powered-by section removed */}
                    </div>
                    <div className="login-info">
                        <h2>{isRegister ? 'Join Our Exchange Network' : 'Welcome Back'}</h2>
                        <p>
                            {isRegister 
                                ? 'Create an account to connect with exchange students, alumni, and find your perfect university match.'
                                : 'Log in to access your exchange connections, university matches, and personalized recommendations.'}
                        </p>
                        <div className="ai-features">
                            <div className="ai-feature">
                                <div className="feature-icon">🎓</div>
                                <div className="feature-text">
                                    <h3>Smart University Matching</h3>
                                    <p>Find your perfect exchange destination with our advanced matching algorithm.</p>
                                </div>
                            </div>
                            <div className="ai-feature">
                                <div className="feature-icon">🔗</div>
                                <div className="feature-text">
                                    <h3>Intelligent Connections</h3>
                                    <p>Connect with students, alumni, and past exchange participants.</p>
                                </div>
                            </div>
                            <div className="ai-feature">
                                <div className="feature-icon">💬</div>
                                <div className="feature-text">
                                    <h3>Smart Conversations</h3>
                                    <p>Get intelligent conversation starters and response suggestions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="login-form-container">
                    <div className="form-header">
                        <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
                        <p>{isRegister ? 'Join our exchange community' : 'Access your account'}</p>
                    </div>
                    
                    {isRegister ? (
                        <form className="login-form" onSubmit={handleRegister}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="university">University</label>
                                <input 
                                    type="text" 
                                    id="university" 
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-full">Create Account</button>
                        </form>
                    ) : (
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-full">Login</button>
                        </form>
                    )}
                    
                    <div className="form-footer">
                        <p>
                            {isRegister 
                                ? 'Already have an account?' 
                                : 'Don\'t have an account?'}
                            <button className="toggle-form" onClick={toggleForm}>
                                {isRegister ? 'Login' : 'Register'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;