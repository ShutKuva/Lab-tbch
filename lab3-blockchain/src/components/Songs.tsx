import { useGetSongs } from "../services/song-service-blockchain";
import SongComponent from "./SongComponent";

export default function Songs() {
  const songs = useGetSongs();

  return (
    <div>
      {songs ? (
        songs.map((song) => (
          <SongComponent songToken={song} key={song}></SongComponent>
        ))
      ) : (
        <p>There is nothing to see here...</p>
      )}
    </div>
  );
}
