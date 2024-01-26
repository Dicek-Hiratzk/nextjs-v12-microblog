import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// postsディレクトリの取得
const postsDirectory = path.join(process.cwd(), "posts");

// mdファイルのデータを取り出す
export function getPostsData() {

  // 外部APIやDB使用する場合(SSR)
  // const fetchData = await fetch("endpoint");

  // オブジェクトの配列として代入
  const fileNames = fs.readdirSync(postsDirectory);
  // 配列の取り出し
  const allPostsData = fileNames.map((fileName) => {
    // 拡張子を取り除いてファイル名(id)取得
    const id = fileName.replace(/\.md$/, ""); 

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    // fullPathで指定された中身のデータを文字列として認識
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 投稿用のメタデータの分析
    const matterResult = matter(fileContents);

    // idとデータを返す
    return {
      id,
      ...matterResult.data, // mdのタイトル日付サムネのオブジェクト配列
    };
  });
  return allPostsData;
};

// getStaticPathsでreturnで使うpathを取得する
export function getAllPostIds() {
  // mdファイル名取得
  const fileNames = fs.readdirSync(postsDirectory);

  // map関数で1つ1つ取り出す
  // idは[id].jsのid([]の中のファイル名と合わせる)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });

  // getStaticPathsはオブジェクトで返さないと正常に動かない
  /*
    [
      {
        params: {
          id: "ssg-ssr"
        }
      },
      {
        params: {
          id: "next-react"
        }
      },
    ]
  */
}

// 識別子idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  // マークダウンファイルを読み取る
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents); // 解析

  // matterResult.contentはブログ本文
  const blogContent = await remark()
  .use(html)
  .process(matterResult.content); 

  // String型へ変換
  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data, // mdのタイトル日付サムネのオブジェクト配列
  };
}
