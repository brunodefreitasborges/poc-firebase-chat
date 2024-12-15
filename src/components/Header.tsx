import Button from '@mui/material/Button';

export interface HeaderProps {
    user: string | undefined
    onSignOut: () => void
}

function Header(props: HeaderProps) {
    return (
      <div className="bg-primary w-screen h-16 flex items-center justify-end px-6">
        {props.user 
        ? <div className='flex gap-5 items-center'>
            <span className='text-white h-fit'>Hello, {props.user}</span>
            <Button variant="contained" onClick={() => props.onSignOut()}>Sign out</Button>
           </div> 
        : <span></span>}
      </div>
    )
  }

  export default Header
