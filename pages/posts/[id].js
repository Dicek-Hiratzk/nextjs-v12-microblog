// [id].js ファイル名(適当)を[]で囲むことで任意のファイル名を指定できる
import { getAllPostIds, getPostData } from "../../lib/post";
import Layout from "../../components/Layout";
import utilsStyles from "../../styles/utils.module.css";
import Head from "next/head";

export async function getStaticPaths() {
  const paths = getAllPostIds();

  // fallback: false, で存在しないpathのページを404エラーにする
  // trueだと動的なページが一瞬生成されるがエラー(blockingはエラーのみ)
  return {
    paths,
    fallback: false,
  };
}

// 引数paramsはブログの情報を取得するための識別子
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  return{
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilsStyles.headingXl}>
          {postData.title}
        </h1>
        <div className={utilsStyles.lightText}>
          {postData.date}
        </div>
        <div dangerouslySetInnerHTML={{__html: postData.blogContentHTML}}/>
        {/* dangerouslySetInnerHTML使う場合、XSS防止などでサニタイズする必要が本来はある */}
      </article>
    </Layout>
  );
}