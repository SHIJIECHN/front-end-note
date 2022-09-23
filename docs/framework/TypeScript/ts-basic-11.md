---
autoGroup-1: Typescript
sidebarDepth: 3
title: 模板字面量类型
---

## 模板字面量类型（Template Literal Types）
当模板中的变量是一个联合类型时，每一个可能的字符串字面量都会被表示。
```typescript
type EmailLocaleIDs = "welcome_email"|"email_heading";
type FooterLocaleIDs = "footer_title"|"footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;

// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | 
// "footer_title_id" | "footer_sendoff_id"
```

## 类型中的字符串联合类型（String Unions in Types）
```typescript
const passedObject = {
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26
}

type PropEventSource<Type> = {
  on(eventName: `${Exclude<keyof Type, symbol>}Changed`, callback: (newValue: any) => void): void
}

declare function makeWatchedObject<Type>(obj: Type): Type & Type & PropEventSource<Type>;

const person = makeWatchedObject(passedObject);
person.on('firstNameChanged', ()=>{});
person.on('firstName', ()=>{});
// Argument of type '"firstName"' is not assignable to parameter of 
// type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
```

模板字面量的推断（Interface with Template Literals）
```typescript
const passedObject = {
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26
}

type PropEventSource<Type> = {
  on<Key extends string&keyof Type>(
    eventName: `${Key}Changed`, 
    callback: (newValue: Type[Key]
  ) => void): void
}

declare function makeWatchedObject<Type>(obj: Type): Type & Type & PropEventSource<Type>;

const person = makeWatchedObject(passedObject);
person.on('firstNameChanged', (newValue)=>{ // (parameter) newValue: string
  console.log(newValue)
});

person.on("ageChanged", newAge => { // (parameter) newAge: number
  console.log(newAge);
})
```

## 内置字符串操作类型（Intrinsic String Manipulation Types）
### Uppercase
把每个字符转为大写形式
```typescript
type Greeting = "hello world";
type ShoutyGreeting = Uppercase<Greeting>;
// type ShoutyGreeting = "HELLO WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<"my_app">
// type MainID = "ID-MY_APP"
```

### Lowercase
把每个字符转为小写形式
```typescript
type Greeting = "Hello World";
type ShoutyGreeting = Lowercase<Greeting>;
// type ShoutyGreeting = "hello world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<"MY_APP">
// type MainID = "id-my_app"
```

## Capitalize
把字符串的第一个字符转为大写形式
```typescript
type LowercaseGreeting = 'hello world';
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello world"
```

### Uncapitalize
把字符串的第一个字符转换为小写形式
```typescript
type UppercaseGreeting = 'HELLO WORLD';
type Greeting = Uncapitalize<UppercaseGreeting>;
// type Greeting = "hELLO WORLD"
```

