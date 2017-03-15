var request = require('request'),
  fs = require('fs'),
  SimpleTokenClient = require('simple-token-client');

function MacMobileApi(config) {
  this.config = config;
  this.tokenClient = new SimpleTokenClient(config);
}

MacMobileApi.prototype.ensure = function (options, done) {
  var self = this;

  self.tokenClient.getToken(function (err, token) {
    if (err) {
      return done(new Error('failed to get access token:' + err.message));
    }

    var url = self.config.endpoint + '/api/v1/mac-mobile';

    request({
      method: 'POST',
      url: url,
      json: true,
      body: options,
      headers: {
        Authorization: 'Bearer ' + token
      }
    }, function (error, response, body) {
      if (error) {
        return done(new Error('failed to query mac-mobile:' + err.message));
      }

      if (response.statusCode !== 200) {
        return done(new Error('failed to query mac-mobile, status:' + response.statusCode + ', body:' + body));
      }

      done(null, body);
    });
  });
};

MacMobileApi.prototype.query = function (options, done) {
  var self = this;

  self.tokenClient.getToken(function (err, token) {
    if (err) {
      return done(new Error('failed to get access token:' + err.message));
    }

    var url = self.config.endpoint + '/api/v1/mac-mobile';

    url += '?skip=' + options.skip + '&limit=' + options.limit +
      '&where=' + JSON.stringify(options.where) + '&sort=' + (options.sort ? JSON.stringify(options.sort) : '');

    request({
      url: url,
      json: true,
      headers: {
        Authorization: 'Bearer ' + token
      }
    }, function (error, response, body) {
      if (error) {
        return done(new Error('failed to query mac-mobile:' + err.message));
      }

      if (response.statusCode !== 200) {
        return done(new Error('failed to query mac-mobile, status:' + response.statusCode + ', body:' + body));
      }

      done(null, body);
    });
  });
};

module.exports = MacMobileApi;
