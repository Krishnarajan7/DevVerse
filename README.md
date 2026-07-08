# ⚡️DevVerse — Web Development Projects⚡️

A community-driven collection of **small yet creative web projects** for beginners and enthusiasts who want to **learn, build, and explore** web technologies.

> 💡 “Code shared is knowledge multiplied.” — DevVerse Community

---

## 🌍 About DevVerse

**DevVerse** is an open-source initiative where developers from around the world share **mini web projects** — from simple landing pages to cool UI effects, fun animations, small JS tools, or full micro-apps.

🎯 **Build. Learn. Contribute. Inspire.**

This repository is a **playground for aspiring web developers** to explore fundamentals (HTML/CSS/JS) and modern stacks while learning how to collaborate on open-source projects.

---

## 💻 Technologies Used

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,react,vue,angular,svelte,tailwind,bootstrap,nodejs,express,python,flask,django,php,laravel,mongodb,postgresql,firebase,vite,webpack,docker,vercel,netlify,github,git" />
</p>

> You’re free to use any technologies — these are just popular examples among DevVerse contributors.

---

## 🎯 Our Mission

We believe in **learning by building**. DevVerse empowers developers to:

* 🧱 Build small yet meaningful projects
* 🧠 Learn web technologies through hands-on practice
* 🤝 Collaborate with the global dev community
* 🌍 Inspire and learn from others’ work

---

## 🧩 Types of Projects You Can Add

* Landing pages
* UI components (buttons, modals, loaders, cards)
* JavaScript games (tic-tac-toe, snake, quiz app)
* Interactive web experiments
* Micro full-stack apps (auth-less demos or mocked backends)
* Fun animations or visual effects

All projects — **big or small** — are welcome!

---

# 🧠 Step-by-Step Contribution Guide

This guide shows **exactly** what to do — even if you’ve never used Git or GitHub before.

---

## 🔁 Before You Start

✅ You need:

1. A [GitHub account](https://github.com)
2. Git installed — [Download Git](https://git-scm.com/downloads)
3. A code editor (VS Code recommended) — [Download VS Code](https://code.visualstudio.com)
4. (Optional) VS Code extension **Live Server** for local preview

---

## 1️⃣ Fork the Repository

1. Visit the main repo: **[DevVerse](https://github.com/Krishnarajan7/DevVerse)**
2. Click the **Fork** button (top-right corner).
   This creates your copy: `https://github.com/<your-username>/DevVerse`

> Forking lets you make changes safely — your fork is your playground.

---

## 2️⃣ Clone Your Fork (Download It Locally)

### Option A — Using Terminal (recommended)

```bash
# Replace <your-username> with your GitHub username
git clone https://github.com/<your-username>/DevVerse
cd DevVerse
```

### Option B — Using GitHub Desktop

1. Install [GitHub Desktop](https://desktop.github.com)
2. Sign in → **File → Clone Repository** → select your fork → Clone.

---

## 3️⃣ Create a New Branch

Always make changes in a separate branch:

```bash
git checkout -b my-awesome-project
```

Example: `git checkout -b weather-app`

---

## 4️⃣ Add Your Project Folder

Create your folder directly under the DevVerse folder:

```
DevVerse/
  my-awesome-project/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── README.md
    ├── meta.json
    └── screenshot.png
```

---

## 5️⃣ Fill Required Files

### `meta.json`

```json
{
  "title": "My Awesome Project",
  "description": "A small, fun web demo built using HTML, CSS, and JS.",
  "image": "screenshot.png",
  "tech": ["HTML", "CSS", "JavaScript"]
}
```

### `README.md`

Example structure:

```md
# My Awesome Project
A stylish and simple web demo built with HTML, CSS, and JavaScript.

## 🛠️ Run Locally
1. cd my-awesome-project
2. Open index.html in your browser  
   OR
   npm run dev or npm start
   (then visit http://localhost:5500)

## 📸 Screenshot
![Preview](screenshot.png)

## 👨‍💻 Author
[Your Name](https://github.com/your-username)
```

---

## 6️⃣ Update `pages.json`

Open the root `pages.json` file and add your folder name:

```json
[
  "weather-app",
  "todo-list",
  "animated-login-form",
  "my-awesome-project"
]
```

> ⚠️ Make sure your name matches exactly (case-sensitive).

---

## 7️⃣ Preview Your Project

Open your HTML file directly or with **VS Code Live Server**:

* Right-click `index.html` → *Open with Live Server*
* If you are using `React +  vite` then run `npm run dev` 
* If you are using `React ` then run `npm start` 
* Or run `python3 -m http.server 5500` and open [http://localhost:5500](http://localhost:5500)

---

## 8️⃣ Commit and Push Changes

```bash
git add .
git commit -m "add: cool mini web demo"
git push origin my-awesome-project
```

---

## 9️⃣ Open a Pull Request (PR)

1. Go to your fork on GitHub
2. You’ll see a **Compare & pull request** button → click it
3. Set base repo as: `Krishnarajan7/DevVerse`
4. Add:

   * **Title:** `add: my-awesome-project — short description`
   * **Description:** What it does, how to run, screenshots/demo
5. Click **Create Pull Request**

---

## 🔍 Review Process

After submission:

* Maintainers will review your project
* You may be asked for small fixes
* Once merged:

  * 🎉 Your project appears in the showcase
  * 🧑‍💻 Your GitHub avatar appears under contributors

---

## 💡 Alternate (No Git Method)

If you’re not familiar with Git:

1. Go to your fork → navigate to `projects/`
2. Click **Add file → Create new file**
3. Name it `projects/my-awesome-project/index.html` and add content
4. Repeat for `style.css`, `meta.json`, `README.md`
5. Click **Commit changes → Create new branch → Create Pull Request**

> ✅ Simple but limited (uploads are slower).

---

## ⚙️ PR Checklist

✅ Before submitting, ensure:

* [ ] Project inside `DevVerse`
* [ ] Includes `meta.json`
* [ ] Includes `README.md`
* [ ] Added to `pages.json`
* [ ] Runs correctly locally
* [ ] No sensitive data or credentials

---

## 🏆 After Your PR is Merged

* Your project is featured on DevVerse
* Your GitHub avatar appears in the contributor graph
* You join our open-source contributors community 🚀

---

## 🫱🏼‍🫲🏽 Contributors

<p align="center">
  <a href="https://github.com/Krishnarajan7/DevVerse/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=Krishnarajan7/DevVerse&nocache=true" alt="contributors"/>
  </a>
</p>


---

## 🧾 License

This repository is licensed under the **MIT License**.
See [LICENSE](./LICENSE) for details.

---

## 💬 Need Help?

If you face issues:

* Open a GitHub **Issue**
* Tag @Krishnarajan7
* Or check the Discussions tab for community help

---

> **Grow. Build. Contribute.**
> Together, we make the web a better place. ✌🏻
