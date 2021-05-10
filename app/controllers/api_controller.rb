class ApiController < ApplicationController
  def clerk_session
    render json: {"foo" => true}
  end
end
