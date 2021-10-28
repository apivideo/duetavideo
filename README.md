# Duet a video

[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video)

[![badge](https://img.shields.io/github/stars/apivideo/duetavideo?style=social)](https://github.com/apivideo/duetavideo)

[![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)

![](https://github.com/apivideo/API_OAS_file/blob/master/apivideo_banner.png)

[api.video](https://api.video) provides video APIs for building, scaling and operating on-demand and live streaming videos in your app, software or platform. This demo app creates a video duet (like on TikTok) that is uploaded to your api.video account. It can then be eassily shared as a [video on demand](https://api.video/what-is/vod-video-on-demand) for your friends to watch!

Try it yourself at [duet.a.video](https://duet.a.video).

## NodeJS

This application has a Node JS backend, but really does not need one. (It does simplify launching on Heroku).

Make sure you have NodeJS installed, and run 

```
npm init
```

to install all the required modules.

## JavaScript

The first 3 lines of /public/index.js havd the variables you must change to get your own version of duet a video up and running. The RTMP and live URLS are generated when you [create a livestream](https://docs.api.video/reference/post_live-streams), and the delegated_token is created from the [Generate an uplaod token](https://docs.api.video/reference/post_upload-tokens) endpoint at api.video.  (There are links to tutorials in the documentation for each endpoint).

Once you update these, you can run the Node server (NPM start), and the app will be upand running!

For more details on how we built this, please read the [blog post](https://api.video/blog/tutorials/video-duets-in-the-browser). It is also heavily based on [record.a.video](https://record.a.video) - links to Github and a tutorial can be found there.

## Questions or comments?

Hop on over to the api.video [community](https://community.api.video)