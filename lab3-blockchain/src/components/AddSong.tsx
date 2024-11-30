import { FC, FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGetTokenForSong } from "../services/song-service-blockchain";
import { addSong, addSongFile } from "../services/song-service-custom-api";
import { decodeEventLog } from "viem";
import contract from "../contracts/contracts.json";

export interface AddSongProps {
  onSongAdded?: () => void;
}

const AddSong: FC<AddSongProps> = ({ onSongAdded }) => {
  const [token, setToken] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState<string>("");
  const { handler: getSongToken } = useGetTokenForSong((logs) => {
    if (logs && logs.length > 0) {
      const log = logs[0];
      const result = decodeEventLog({
        abi: contract,
        topics: [...log.topics],
        data: log.data,
      });

      if (result.args && (result.args as unknown as { token: string }).token) {
        setToken((result.args as unknown as { token: string }).token);
      }
    }
  });

  useEffect(() => {
    if (token && files && files.length > 0 && name) {
      addSong({
        songToken: token,
        name,
        listenings: 0,
      })
        .then(() => {
          return addSongFile(token, files[0]);
        })
        .then(() => {
          onSongAdded && onSongAdded();
          window.location.reload();
        });
    }
  }, [token]);

  const handleSetFiles = (event: FormEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      setFiles([...files]);
    }
  };

  const sendSong = () => {
    getSongToken([]);
  };

  return (
    <div>
      <input type="file" onChange={handleSetFiles} />
      <input type="text" onChange={(event) => setName(event.target.value)} />
      <button type="button" onClick={sendSong}>
        Send
      </button>
    </div>
  );
};

export default AddSong;
