# 🖼️ _Optimize_ Right Where You Are


![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brighktgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

>A _fast_ and _interactive_ CLI for __converting__ and __optimizing__ `JPG`, `JPEG`, `PNG`, `TIF`, and `TIFF` images into _clean_, _lightweight_ `WebP` files — without ever leaving your project directory.
Built with <u>Sharp</u> for _speed_ and <u>Clack</u> for _pleasant_ terminal vibes. Just open terminal, run command, ship optimized assets.


## 🔍 <mark>Features</mark>

-  🏎️ **Turbo Mode** `One-click` lossless optimization ✅


- 🔧 **Custom Mode** Choose your own <u>quality</u> and <u>compression</u> settings ✅


- 🧠 **CPU-Aware Concurrency** Powered by a native `Worker Pool` algorithm that _scales_ with your CPU cores ✅

 
- 📂 **Smart Folder Scan** `Automatically` detects directories if no path is provided ✅


- 💎 **Transparency Support** Preserves _alpha_ channels for `.png` and `.tif` files ✅


- 🌈 **Modern UI** Beautiful prompts powered by `@clack/prompts` ✅

## 📦 <mark>Installation</mark>


Install it __globally__ via `NPM` to use it <u>anywhere</u> in your system 👌
``` bash
npm install -g sajjadlabs-webp
```

## 🎨 <mark>Usage</mark>


Simply <u>run the command</u> and _follow_ the interactive prompts 👇
``` bash
sl-webp
```
Or provide a _specific_ directory path 👇
``` bash
sl-webp ./src/assets/images
```
The <u>optimized output</u> will be created beside your _input folder_, with the same name plus `_optimized`.
### Example 🧪

> Say your images _live_ in a folder called `image`
> ```
> sl-webp image
> ```
> After that, your _optimized_ files will show up in a new **sibling** folder called `image_optimized`.

## 🛠️ <mark>Supported Formats</mark>


+ `JPG / JPEG` ✅


+ `PNG` ✅


+ `TIFF / TIF` ✅
 

+ `AVIF`✅

## ⚙️ <mark>Settings Explained</mark>


| Mode           |  Quality   |  Lossless  | Best For                           |
|----------------|:----------:|:----------:|------------------------------------|
| **Turbo**      |   `100`    |    Yes     | *Archiving & maximum quality*      |
| **Ultra**      |    `90`    |     No     | *Portfolio & high-end photography* |
| **Balanced**   |    `75`    |     No     | *General web usage (Recommended)*  |
| **Economic**   |    `50`    |     No     | *Smallest file size*               |

## 🙌 <mark>Contributing</mark>


**Pull requests**, **issues**, and _feature ideas_ are welcome.

> If you spot a **bug** or **have an idea** that would make this _cleaner_, _faster_, or _less cursed_, please open an issue and <u>let’s talk</u> ❤️

## ✍️ <mark>License</mark>

Released under the **MIT License**. Built with care by `SajjadLabs` ^_^

