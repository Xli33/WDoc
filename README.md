# 已彻底废弃，不进行任何维护，仅作为存档用！！
# Totally Deprecated!!

## web common components

#### [访问文档](http://209.250.239.181:8080/)
关于谷歌浏览器报毒，真的木有っﾟДﾟ)っ

> #### 关于 *自定义标签*  使用方式中的 $.formatter__ 等对象 
> 由于可能用到事件绑定或者通过函数/方法返回需填充的HTML片段，故**为了避免全局污染及将函数体写在标签中或后台返回的配置中**，而定义了诸如：`$.formatter__`(帮助组件)、`$.tools__[tips|alert|switch|loader]`(其他组件) 等对象用于挂载需要执行的方法，名称随意，保证与标签中参数值相同即可 

eg: 
 ```html
 <alert data-title='' data-html='fillHtml' data-onconfirm='confirm' data-oncancel='cancel'></alert>
 
 $.tools__.alert = {
   fillHtml: function(){
      return [
         '<button class="btn btn-info btn-sm rightSize detailBtn" type="button"><i class="fa fa-paste"></i>详情</button>',
         '<button class="btn btn-danger btn-sm rightSize packageBtn" type="button"><i class="fa fa-envelope"></i>通知</button>',
         '<h4>h4</h4>'
      ].join('');
   },
   confirm: function(){
     console.log('点了确定');
   },
   cancel: function(){
     console.log('点了取消');
  }
}
 ```

> #### 关于 “统一url参数部分”
> 部分组件如下拉帮助类约定好公告的url，如： `http://127.0.0.1:8080?code=`,然后根据参数的不同返回不同数据 

eg: 
 ```html
 <sel data-id='account' data-name='account' data-width='220' data-placeholder='请选择' data-code='ACT'></sel> 
 
 //会请求 http://127.0.0.1:8080?code=ACT 这一接口，并且即使有data-url属性也会忽略。若使用data-url则应填完整的url
 ```

#### 返回数据格式示例：

```json
 {
  "success": true,
  "list": [
      {
        "q": "华东",
        "w": "HD"
      },
      {
        "q": "华南",
        "w": "HN"
      },
      {
        "q": "华中",
        "w": "HZ"
      },
      {
        "q": "华北",
        "w": "HB"
      },
      {
        "q": "西南",
        "w": "XN"
      },
      {
        "q": "西北",
        "w": "XB"
      },
      {
        "q": "东北",
        "w": "DB"
      },
      {
        "q": "海外",
        "w": "HW"
      }
   ]
}
```
