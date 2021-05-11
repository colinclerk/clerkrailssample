require "net/http"
require "json"

class ApiController < ApplicationController
  before_action :force_user

  def clerk_user
    render json: {id: current_user_id}
  end

  private

  def force_user
    if !(@current_user_id || current_user_id)
      render json: {error: "No user session."}, status: 401
    end
  end

  def current_user_id
    if @ran_current_user_id
      return @current_user_id
    end
    @ran_current_user_id = true

    begin
      @current_user_id = JsonWebToken.verify(params[:jwt])["sub"]
    rescue => e 
      @current_user_id = nil
    end
    @current_user_id
  end
end
