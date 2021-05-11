# frozen_string_literal: true
require 'net/http'
require 'uri'

class JsonWebToken
  def self.verify(token)
    JWT.decode(token, clerk_jwk, true, algorithms: 'RS256')[0]
  end

  def self.clerk_jwk
    # Run `rails dev:cache` to make this cache in development
    Rails.cache.fetch("clerk_jwk", expires_in: 2.hours) do
      jwks_url = "#{ENV["CLERK_FRONTEND_API"]}/v1/.well-known/jwks.json"
      jwks_raw = Net::HTTP.get URI(jwks_url)
      jwks_data = JSON.parse(jwks_raw)
      jwk = jwks_data['keys'].first
      JWT::JWK.import(jwk).keypair   
    end
  end
end