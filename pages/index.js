import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [dreamInput, setDreamInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/chatgpt-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream: dreamInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setDreamInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Dreamcatchr</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Interpret my dream</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="dream"
            placeholder="Tell me your dream to receive an interpretation!"
            value={dreamInput}
            onChange={(e) => setDreamInput(e.target.value)}
          />
          <input type="submit" value="Interpret dream" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
