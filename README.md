# 【抛砖引玉】使用 ES6 的类继承加速 SPA 开发

## 背景
随着 ES6 和 SPA 框架的普及，前端开发已经在从以往的**页面为主体**向**组建为主体**进行改变，而组建的重用可以使用类继承来加速前端开发。下面就是一个简单的继承实现的例子。

## 初始化项目
本文使用 angular6.0 + ng-zorro1.4 作为范例，首先初始化项目 ng-extents-components：

```sh
ng new ng-extents-component
cd ng-extents-component
ng add ng-zorro-antd
```

初始化完成后执行 `ng serve` 即可访问 [http://localhost:4200](http://localhost:4200) 如图：

![](http://olvskviha.bkt.clouddn.com/2018-08-28-15354289163313.jpg)

## 新增 LoginPageComponent 和 RegisterPageComponent 并配置路由
ng-zorro 为我们提供了基于 Schematics 的模板，我们可以直接选择适应的模板新建 LoginPageComponent 和 RegisterPageComponent ：

```shell
ng g ng-zorro-antd:form-register -p app --styleext='scss' --name=register-page
ng g ng-zorro-antd:form-normal-login -p app --styleext='less' --name=login-page
```

新建完成后修改 `src/app/app.module.ts` 的 imports 字段，添加响应式表单支持并配置路由：

```TypeScript
...
ReactiveFormsModule,
RouterModule.forRoot([
      {path:'login',component:LoginPageComponent},
      {path:'register',component:RegisterPageComponent}
    ]),
...
```

随后修改 `src/app/app.module.ts` 添加 router-outlet：

```
<!-- NG-ZORRO -->
<!--<a href="https://github.com/NG-ZORRO/ng-zorro-antd" target="_blank" style="display: flex;align-items: center;justify-content: center;height: 100%;width: 100%;">-->
<!--<img height="300" src="https://img.alicdn.com/tfs/TB1NvvIwTtYBeNjy1XdXXXXyVXa-89-131.svg">-->
<!--</a>-->
<router-outlet></router-outlet>
```

完成后即可访问  [http://localhost:4200/login](http://localhost:4200/login) 和  [http://localhost:4200/register](http://localhost:4200/register) 如图所示：

![](http://olvskviha.bkt.clouddn.com/2018-08-28-15354303246165.jpg)
![](http://olvskviha.bkt.clouddn.com/2018-08-28-15354303538886.jpg)

## 使 LoginPageComponent 继承基类 TablePageBasicComponent
LoginPageComponent 和 RegisterPageComponent 实际其本质均为响应式表单，**登录**和**注册**操作的本质均为提交表单，我们完全可以为两者抽象一个基类 `TablePageBasicComponent` 如下：

```TypeScript
import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  template: ''
})
export class TablePageBasicComponent {
  validateForm: FormGroup; // 存放实例化后的 FormGroup
  submitUrl: string = ''; // 存放 submit 方法的 url ，子类可以对其重写

  constructor(public fb: FormBuilder, public http: HttpClient) { // 基类的构造函数，将所有的类依赖以 public 的方式注入，以供子类访问
  }

  ngOnInit(): void { // 基类 ngOnInit 方法
    console.log('TablePageBasicComponent.ngOnInit()');
  }

  submitForm(): void { // 基类 submitForm 方法
    console.log('TablePageBasicComponent.submitForm()');
    console.log(this.validateForm.value);
    this.http.post(this.submitUrl,this.validateForm.value).subscribe(resp => {
      console.log(resp)
    });
  }
}
```

我们在子类使用时，只需要修改 submitUrl 即可对提交的 url 进行修改，但因为使用了响应式表单，我们还需在各个子类内重写 ngOnInit(): void。

下面使 LoginPageComponent 继承自 TablePageBasicComponent，代码如下：

```TypeScript
import { Component } from '@angular/core';
import {TablePageBasicComponent} from "../basic-components/table-page.basic.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent extends TablePageBasicComponent{
  submitUrl='http://yapi.youhujia.com/mock/42/demo/login';

  ngOnInit(): void {
    super.ngOnInit();
    console.log('LoginPageComponent.ngOnInit()');
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
}

```

点击登录按钮后，我们可以看到以下输出：

```
table-page.basic.component.ts:16 TablePageBasicComponent.ngOnInit()
login-page.component.ts:15 LoginPageComponent.ngOnInit()
table-page.basic.component.ts:20 TablePageBasicComponent.submitForm()
table-page.basic.component.ts:21 {userName: "18000000000", password: "test", remember: true}
```

同样我们可以使 RegisterPageComponent 继承自 TablePageBasicComponent ，此处不详细实现，大家可以[访问 Github 查看该项目](https://github.com/supperdsj/ng-extents-component)

## 使用继承的价值
* 抽象同类功能，比较有代表性的就是后台项目的列表、详情等页面
    为各类页面分别抽象基类，并可使同类页面使用统一模板，重写基类配置快速实现同类页面
* 可快速统一修改基类的同一方法
    设想现项目有20个详情页，PM 飘过来跟你说当页面保存的时候给我加一个提示框让用户选择是否会到列表页，我们此时就可以修改基类的代码统一进行修改了
* 可通过重写属性减少重复代码
    我们的 team 内最常用的就是通过 getDataService/sendDataService 属性来控制页面的获取/提交数据，可参考我之前的文章 [从零实现 SPA 框架快速同步配置生成接口(angular2 + Easy-mock)](http://blog.dongsj.cn/20180330-entity-service.html)

## 项目组内后台项正在使用的基类及项目结构
我们项目组内大量使用了各类组件基类的继承以简化各个组件的实现，下面仅作展现供参考讨论，不进行详细的展开。

### 项目组内正在使用的基类和对应功能

* BasicComponent
    公共基类，管理所有基类共有的依赖、输入参数、事件等
* PageBasicComponent
    页面基类，继承自 BasicComponent，管理所有页面的面包屑导航、弹框处理等
* TablePageBasicComponent
    列表页基类，继承自 PageBasicComponent，管理所有列表页的数据加载、按钮控制等
* CreatePageBasicComponent
    新建页基类，继承自 PageBasicComponent，管理所有新建页的数据提交、按钮控制等
* DetailPageBasicComponent
    详情页基类，继承自 CreatePageBasicComponent，管理所有详情页的状态切换、数据提交、按钮控制等
* TableViewBasicComponent
    列表组件基类，继承自 BasicComponent，通常嵌入到 TablePageBasicComponent，提供输入参数/数据接口/各类事件来管理业务数据的展示和事件触发
* FormViewBasicComponent
    表单组件基类，继承自 BasicComponent，通常嵌入到 CreatePageBasicComponent 或 DetailPageBasicComponent，提供输入参数/数据接口/各类事件来管理业务数据的展示和事件触发
* SelectorViewBasicComponent
    选择器组件基类，继承自 BasicComponent，通常嵌入到 FormViewBasicComponent，提供输入参数/数据接口/各类事件来管理业务数据的展示和事件触发

### 对应的项目结构
* entites
    存放所有后端接口 Service ，参考我之前的文章 [从零实现 SPA 框架快速同步配置生成接口(angular2 + Easy-mock)](http://blog.dongsj.cn/20180330-entity-service.html)
* pipes
    存放所有自定义 pipes
* services
    存放所有自定义 services
* basics
    存放所有基类
* layouts
    存放所有业务无关的布局组件
* views
    存放所有业务相关的 views 组件，通常继承自 TableViewBasicComponent/FormViewBasicComponent/SelectorViewBasicComponent
* pages
    存放所有关联后端数据的 pages 组件，通常继承自 PageBasicComponent 的各子类

## 结语
本文只是抛砖引玉简单的实现了一个类继承的项目，而实际开发过程中还是需要结合需求对项目进行梳理。感兴趣的同学可在我的[博客进行留言我会定期进行回复](http://blog.dongsj.cn/20180828-ng-extents-component.html)。

