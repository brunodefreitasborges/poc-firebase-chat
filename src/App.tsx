// App.tsx
import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from './firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RootState, AppDispatch } from './store/store';
import { setUser, fetchUserDetails } from './store/slices/userSlice';
import Header from './components/Header';
import Chat from './components/Chat';
import SignIn from './components/SignIn';
import UserDetails from './components/UserDetails';
import Loader from './components/Loader';

function App() {
  const [firebaseUser, loadingUser] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const { user, userDetails, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (firebaseUser) {
      dispatch(setUser({ uid: firebaseUser.uid }));
      dispatch(fetchUserDetails(firebaseUser.uid));
    } else {
      dispatch(setUser(null));
    }
  }, [firebaseUser, dispatch]);

  if (loadingUser || loading) {
    return <Loader/>;
  }

  return (
    <div className="App bg-background h-screen">
      <Header user={userDetails?.displayName} onSignOut={() => auth.signOut()} />
      <section>
        {user ? (
          userDetails ? (
            <Chat userDetails={userDetails} />
          ) : (
            <UserDetails user={user} />
          )
        ) : (
          <SignIn />
        )}
      </section>
    </div>
  );
}

export default App;
