import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

import Layout, { siteTitle } from "@/components/Layout";
import utilsStyles from "../styles/utils.module.css";
import { getPostsData } from "../lib/post";

// SSGの場合 
// getStaticProps()はnext.js独自の関数(外部から一度だけデータ取得)
export async function getStaticProps() {
  const allPostsData = getPostsData(); // id, title, data, thumbnail
  console.log(allPostsData );

  return {
    props: {
      allPostsData,
    },
  };
}

// SSRの場合 
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // コンポーネントに渡すためのprops
//     },
//   };
// }

export default function Home({ allPostsData }) {
  return (
  <Layout home>
    <Head>
      <title>{siteTitle}</title>
    </Head>
    <section className={utilsStyles.headingMd}>
      <p>Next.js version.12で作るブログアプリです。</p>
    </section>

    <section className={`${utilsStyles.headingMd} ${utilsStyles.padding1px}`}>
      <h2>📝Next.js関連のブログ</h2>
      <div className={styles.grid}>
        {allPostsData.map(({id, title, date, thumbnail}) => (
          <article key={id}>
            <Link href={`/posts/${id}`}>
              <img 
                src={`${thumbnail}`}
                className={styles.thumbnailImage}
              />
            </Link>
            <Link href={`/posts/${id}`} legacyBehavior>
              <a className={utilsStyles.boldText}>
                {title}
              </a>
            </Link>
            <br />
            <small className={utilsStyles.lightText}>
              {date}
            </small>
          </article>
        ))}
      </div>
    </section>

  </Layout>
  );
};
