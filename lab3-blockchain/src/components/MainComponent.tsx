import {
  useCheckRegister,
  useRegister,
} from "../services/song-service-blockchain";
import AddSong from "./AddSong";
import Songs from "./Songs";

const MainComponent = () => {
  const { handler: hadleRegisterUser } = useRegister();
  const isRegistered = useCheckRegister();
  console.log("Is registered? ", isRegistered);
  return (
    <div>
      {!isRegistered ? (
        <button onClick={() => hadleRegisterUser([])}>Register</button>
      ) : (
        <>
          <p>You are logged in!</p>
          <AddSong></AddSong>
          <Songs></Songs>
        </>
      )}
    </div>
  );
};

export default MainComponent;
