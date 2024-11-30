import { AudioHTMLAttributes, createRef, FC, useEffect, useState } from "react";
import {
  getSong,
  getSongFile,
  listenSong,
} from "../services/song-service-custom-api";
import Song from "../interfaces/Song";
import {
  useGetRoyalty,
  useGetRoyaltyWithPartner,
  useListenSong,
  useSyncListenings,
} from "../services/song-service-blockchain";

export interface SongProps {
  songToken: string;
}

const SongComponent: FC<SongProps> = ({ songToken }) => {
  const [song, setSong] = useState<Song>();
  const [songFileUrl, setSongFileUrl] = useState<string>("");
  const ref = createRef<HTMLAudioElement>();
  const { handler: handleSyncListenings } = useSyncListenings(songToken);
  const royalty = useGetRoyalty(songToken);

  useEffect(() => {
    getSong(songToken).then((song) => song && setSong(song));
    getSongFile(songToken).then((file) => {
      file && setSongFileUrl(file);
    });
  }, []);

  const handleListenSong = () => {
    listenSong(songToken).then(() => {
      setSong(song && { ...song, listenings: song.listenings + 1 });
    });
  };

  const handleSync = () => {
    if (song) {
      handleSyncListenings([song.listenings]);
    }
  };

  ref.current?.load();

  return song ? (
    <div>
      <h3>{song?.name}</h3>
      <h4>Listenings: {song?.listenings}</h4>
      <h4>Royalty: {royalty.toString()}</h4>
      <button onClick={handleSync}>Sync listenings</button>
      <audio
        controls={true}
        ref={ref}
        src={songFileUrl}
        onPlay={handleListenSong}
      ></audio>
    </div>
  ) : (
    <div></div>
  );
};

export default SongComponent;
