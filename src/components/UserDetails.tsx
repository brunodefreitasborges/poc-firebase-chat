import { Button, TextField } from "@mui/material"
import { db } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";

export interface UserDetailsProps {
    user: {uid: string}
}

function UserDetails(props: UserDetailsProps) {

    const usersRef = collection(db, "users");

    const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { name } = Object.fromEntries(
            new FormData(event.currentTarget).entries()
        ) as { name: string };

        await addDoc(usersRef, {
            uid: props.user,
            displayName: name
          });
        
    }


    return (
        <section className='flex items-center justify-center h-[calc(100vh_-_64px)]'>
            <form className='flex flex-col justify-center items-center gap-5 w-[400px] h-[400px] bg-primary rounded-xl'
             onSubmit={handleUpdateUser}>
                <TextField 
                slotProps={{ input: { className: 'text-blue-500 border-blue-500' }, inputLabel: { className: 'text-blue-500'} }}  
                label="Email" variant="outlined" name="name"/>

                <Button type="submit" variant="outlined">Save changes</Button>
            </form>
        </section>
    )
  }

  export default UserDetails;