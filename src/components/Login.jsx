import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: '10px' }}>
      {user ? (
        <div>
          <p>Hola, {user.displayName}!</p>
          <img src={user.photoURL} alt="perfil" width="40" style={{ borderRadius: '50%' }} />
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Acceder con TacticalDraw</button>
      )}
    </div>
  );
}