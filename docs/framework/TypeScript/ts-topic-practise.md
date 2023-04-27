---
autoGroup-3: Typescript
sidebarDepth: 3
title: Typescript练习
---

## 练习记录

```typescript

  // type X =  Promise<string>
  // type Y = Promise<{filed: number}>

  // type ResultX = Transform<X>;
  // type ResultY = Transform<Y>;

  // type Transform<A>  = A extends Promise<infer R> ? R : never

  // type Surprise<A> = {code: A};
  // type UnpackSurprise<S> = S extends Surprise<infer Inside> ? Inside : never;
  // type Num = UnpackSurprise<Surprise<number>>

  // type User = {
  //     id: number,
  //     name: string
  // }

  // type Doc = {
  //     id: string
  // }

  // // 
  // type GetProperty<T, Prop extends keyof T> = T extends {[K in Prop]: infer Value} ? Value : never
  // type UserId = GetProperty<User, 'id'> // number
  // type DocId = GetProperty<Doc, 'id'> // string

  // // ABC<string, boolean, number> -> [string, boolean, number]
  // type ABC<A, B, C> = {a: A, b: B, c: C};
  // type ABCIntoTuple<T> = T extends ABC<infer A, infer B, infer C> ? [A, B, C]: never
  // type Example = ABC<string, boolean, number>
  // type ExampleTuple = ABCIntoTuple<Example>

  //******************************Section two********************************** */
  // type User = {
  //     id: number;
  //     kind: string;
  // }

  // /**
  //  * 错误原因：T extends User 说明T有User的字段，但是也可以有其他的字段，返回值是T类型
  //  */
  // // function makeCustomer<T extends User>(u: T): T {
  // //     return {
  // //         id: u.id,
  // //         kind: 'customer'
  // //     }
  // // }

  // /**
  //  * 因为u是具有T类型的所有字符,所以将u展开,补充User类型的字段,也可以不写User类型的字段
  //  */
  // function makeCustomer<T extends User>(u: T): T {
  //     return {
  //         ...u, // spread all properties of u being T
  //         id: u.id, //  yes redundant line, leaving it for consistency
  //         kind: 'customer'
  //     }
  // }

  // type Merge<T> ={
  //     [P in keyof T]: T[P]
  // }

  // type Admin = User &{ kind: 'admin'} // 合并后User中的字段类型会被替换掉 {id: number, kind: 'admin'}
  // type R = Merge<Admin> // {id: number, kind: 'admin'}

  // type IsAdminUser = Admin extends User ? true : false // true
  // const admin = makeCustomer({id: 1, kind: 'admin'} as Admin) // admin: Admin
  // console.log(admin); // {id: 1, kind: 'customer'} 

  // // 不符合预期。需要将makeCustomer中的返回值id，kind去掉。


  //  b 是string | number类型，a 是number类型，两者不能使用 + 号
  // function f(a: string | number, b: string | number){
  //     if(typeof a === 'string'){
  //         return a + ':' + b;
  //     }else{
  //         return a + b; // Operator '+' cannot be applied to types 'number' and 'string | number', 
  //     }
  // }

  // // Solution 1：a 和 b都是string，或者都是number。使用as断言
  // function f<T extends string | number, R extends (T extends string ? string : number)>(a: T , b: T){
  //     if(typeof a === 'string'){
  //         return a + ':' + b as R;
  //     }else{
  //         return ((a as number) + (b as number)) as R; 
  //     } 
  // }
  // f(2, 3);
  // f('a','b');

  // Solution 2：将传入参数组成一个类型string[] | number[]，参数要么全是字符串，要么全是数组
  // const isStrArr = (a:string[]|number[]): a is string[] => typeof a[0] === 'string'; // 传入的参数是字符串数组或数字数组，如果是字符串则返回true
  // function f(...args: string[] | number[]){
  //     if(isStrArr(args)){
  //         return args[0] + ':' + args[1];
  //     }else{
  //         return args[0] + args[1]; 
  //     }
  // }

  // const a = f(1,2); // 返回值一直是string|number，而不是确定的类型
  // const b = f('a', 'b'); // b: string|number


  // // Solution 3: 参数泛型组合.同样需要断言R
  // const isNumArr = (a: string[] | number[]): a is number[] => typeof a[0] === 'number';

  // function f<T extends string[] | number[], R extends (T extends string[] ? string : number )>(...args: T): R{
  //     if(isNumArr(args)){ // number 
  //         return args[0] + args[1] as R;
  //     }else{
  //         return args[0] +':'+args[1] as R ;
  //     }
  // }
  // const a = f(1,2); // a: number
  // const b = f('a', 'b');// b: string

  // // Solution 4: 函数重载
  // function f(a: string, b: string): string;
  // function f(a: number, b:number): number;
  // function f(a: string | number, b: string |number): string | number{
  //     if(typeof a === 'string'){
  //         return a + ':' + 'b';
  //     }else{
  //         return ((a as number) + (b as number));
  //     }
  // }
  // const a = f(1,2); // a : number
  // const b = f('a', 'b'); // b: string 

  //************************Section four**************************** */
  type  SomeF = (a: number, b: string) => number;
// type AppendArgument<F, A> = F extends (...args: any[]) => infer R ? (x: A, ...args: any[])=> R : never
// type FinalF = AppendArgument<SomeF, boolean> ;// (x: boolean, a: number, b: string) => number

// Solution 1: 使用Parameters 和 ReturnType
// type AppendArgument<F extends (...args: any) => any, A> = (x: A, ...args: Parameters<F>) => ReturnType<F>;
// type FinalF = AppendArgument<SomeF, boolean>

// Solution 2: 使用infer
// type AppendArgument<F, A> = F extends (...args: infer Args)=> infer Return ? (x: A, ...args: Args) => Return : never;
// type FinalF = AppendArgument<SomeF, boolean>


//************************Section five**************************** */
// getUser函数根据config参数传入的name和lastname属性确定返回值。当name为true时，返回值包含name，否则没有name
type Config = {
  name: boolean,
  lastname: boolean
}
type User = {
  name?: string,
  lastname?: string
}

declare function getUser<
  C extends Config,
  >(config: Config): User;

const user = getUser({ name: true, lastname: false });
user.name;
```
