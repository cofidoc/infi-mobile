import { useState, useEffect } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Loader } from "./Loader";

export function ImgStorage({ path }: { path: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const storageRef = ref(storage, path);
    getDownloadURL(storageRef).then((_url) => setUrl(_url));
  });

  if (!url) return <Loader />;

  return <img src={url} alt={path} height="50px" />;
}
