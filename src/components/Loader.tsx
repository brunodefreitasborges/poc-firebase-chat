import { CircularProgress } from "@mui/material"


function Loader() {
    return (
        <div className="bg-background h-screen w-screen flex items-center justify-center">
            <CircularProgress />
        </div>
    )
}

export default Loader
