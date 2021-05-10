require "net/http"
require "json"

class ApiController < ApplicationController
  before_action :force_current_session

  def clerk_user
    render json: {id: current_user_id}
  end

  private

  def get_current_session
    # Make sure this only runs once when @current_session is nil
    if @ran_current_session
      return nil
    end
    @ran_current_session = true

    # Retrieve session object from clerk API
    begin
      uri = URI('https://api.clerk.dev/v1/clients/verify')
      params = {'token': cookies[:__session]}
      headers = {'Authorization' => "Bearer #{ENV["CLERK_API_KEY"]}"}
      http = Net::HTTP.new(uri.host)
      res = http.post(uri.path, params.to_query, headers)
      session = JSON.parse(res.body)["sessions"].first
      @current_session = session["status"]=="active" ? session : nil
    rescue => e 
      @current_session = nil
    end
    return @current_session
  end

  def force_current_session
    if !(@current_session || get_current_session)
      render json: {error: "No user session."}, status: 401
    end
  end

  def current_session
    @current_session || get_current_session
  end

  def current_user_id
    session = @current_session || get_current_session
    return session ? session["user_id"] : nil
  end  
end
