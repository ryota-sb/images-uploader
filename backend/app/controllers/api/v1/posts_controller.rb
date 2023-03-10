class Api::V1::PostsController < ApplicationController
  def index
    posts = Post.all
  end

  def create
    post = Post.create(post_params)
    if post.save
      render json: post
    else
      render json: post.errors, status: :unprocessable_entity
    end
  end

  def update
    post = Post.find(params[:id])
    if post.update(post_params)
      render json: post
    else
      render json: post.errors, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :image)
  end
end
