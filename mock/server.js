var koa = require('koa');
var app = new koa();
var koaBody = require('koa-body')();
var router = require('koa-router')();
var homeAdData = require('./home/index.js');
router.get('/api/listOfBooks', function (ctx,next) {
  console.log('详情页 - 商户信息');
  ctx.body = homeAdData;
});
app.use(router.routes())
  .use(router.allowedMethods());
console.log('2222')
app.listen(3000);
