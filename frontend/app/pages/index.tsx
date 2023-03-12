import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { useForm, SubmitHandler } from "react-hook-form";

import { InputValue, PostData } from "../types";

const Home: NextPage = () => {
  // 画像の状態管理
  const [image, setImage] = useState<File | null>(null);
  // 投稿データの状態管理
  const [posts, setPosts] = useState<PostData[]>([]);

  const router = useRouter();

  // useFormの中の必要なメソッドを使用できるように設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputValue>({
    mode: "onChange",
    defaultValues: { title: "", image: { url: "" } },
  });

  // フォームのファイル選択画像で選択されたファイルデータをsetImageに追加
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  // ボタンを押した時にFormDataに入力内容を追加し、RailsAPIにPOSTして登録する
  const onSubmit: SubmitHandler<InputValue> = async (inputValue) => {
    const formData = new FormData();
    formData.append("post[title]", inputValue.title);
    formData.append("post[image]", image!, image!.name);

    const response = await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    router.reload();
  };

  // postを全取得する
  const getPosts = async () => {
    const response = await fetch("http://localhost:3000/api/v1/posts");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="text-5xl my-10">Images Uploader</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-3">
              <label htmlFor="title">タイトル</label>
              <input
                type="text"
                {...register("title", { required: true })}
                className="border border-black py-2 px-4"
              />
              {errors.title && (
                <h1 className="text-red-500">タイトルは必須です</h1>
              )}
            </div>
            <div className="flex flex-col gap-y-3">
              <label htmlFor="image">画像アップロード</label>
              <input
                type="file"
                {...register("image", { required: true })}
                className="border border-black py-2 px-4"
                onChange={onFileInputChange}
              />
              {errors.image && <h1 className="text-red-500">画像は必須です</h1>}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-8 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              追加する
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3">
          {posts &&
            posts.map((post: PostData) => (
              <div key={post.id}>
                <h1>{post.title}</h1>
                <Image src={post.image.url} width={300} height={300} alt={""} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
