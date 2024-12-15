import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function SignIn() {

    const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, password } = event.currentTarget.elements as typeof event.currentTarget.elements & {
            email: HTMLInputElement;
            password: HTMLInputElement;
        };
        signInWithEmailAndPassword(getAuth(), email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <section className='flex items-center justify-center h-[calc(100vh_-_64px)]'>
            <form className='flex flex-col justify-center items-center gap-5 w-[400px] h-[400px] bg-primary rounded-xl'
             onSubmit={handleSignIn}>
                <TextField 
                slotProps={{ input: { className: 'text-blue-500 border-blue-500' }, inputLabel: { className: 'text-blue-500'} }}  
                label="Email" variant="outlined" name="email"/>
                <TextField 
                slotProps={{ input: { className: 'text-blue-500' }, inputLabel: { className: 'text-blue-500'} }} 
                label="Password" variant="outlined" name="password" type='password'/>
                <Button type="submit" variant="outlined">Sign in</Button>
            </form>
        </section>
    )
}
  
export default SignIn
