import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import MainComponent from "../components/MainComponent";

const Home: NextPage = () => {
  const { address } = useAccount();

  return (
    <div className={styles.container}>
      <Head>
        <title>Lab 3</title>
      </Head>

      <main className={styles.main}>
        <ConnectButton />
        {address ? (
          <MainComponent></MainComponent>
        ) : (
          "You are not logged with wallet."
        )}
      </main>
    </div>
  );
};

export default Home;
