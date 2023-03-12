export type InputValue = {
  title: string;
  image: { url: string };
};

export type PostData = InputValue & {
  id: number;
  created_at: Date;
  update_at: Date;
};
