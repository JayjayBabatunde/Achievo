import { HashLoader } from "react-spinners";

export default function Loader() {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <HashLoader
          color="#36d7b7"
          size={80}
          speedMultiplier={1.5}
        />
      </div>
    </div>
  )
}
