import axiosInstance from "../api/axios-instance";
import Song from "../interfaces/Song";

export function addSong(song: Song) {
  return axiosInstance.post("song", song);
}

export function addSongFile(songToken: string, file: File) {
  const formData = new FormData();

  formData.append("file", file);

  return axiosInstance.postForm(`song/${songToken}/file`, formData);
}

export function getSongs() {
  return axiosInstance.get<Song[]>("song").then((resp) => resp.data);
}

export function getSong(token: string) {
  return axiosInstance
    .get<Song>(`song/${token}`)
    .then((resp) => resp.data)
    .catch((error) => console.log(error));
}

export function getSongFile(token: string) {
  return axiosInstance
    .get(`song/${token}/file`, {
      responseType: "blob",
    })
    .then((response) => {
      const { data } = response;
      return URL.createObjectURL(data);
    })
    .catch((error) => console.log(error));
}

export function listenSong(token: string) {
  return axiosInstance.patch(`song/${token}`);
}
