# 🤝 Contributing to DevVerse

Thank you for your interest in contributing to **DevVerse**! 💫
This project is built by and for the developer community — a space to share mini web projects, learn from others, and grow together.

Please take a few minutes to read this guide before contributing.

---

## 🧭 Table of Contents

1. [How You Can Contribute](#how-you-can-contribute)
2. [Project Structure](#project-structure)
3. [Contribution Steps](#contribution-steps)
4. [Adding Your Project](#adding-your-project)
5. [Code Guidelines](#code-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Community Standards](#community-standards)

---

## 🚀 How You Can Contribute

You can contribute by:

* Adding your **mini web project** or creative experiment.
* Improving the **documentation** (README, CONTRIBUTING, etc.).
* Enhancing **UI/UX** or optimizing existing projects.
* Reporting bugs or suggesting new features via **Issues**.

---

## 🗂 Project Structure

Each contribution should follow this structure:

```
DevVerse/
│   ├── your-project-name/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── meta.json
│   │   └── README.md
├── pages.json
└── README.md
```

Your `meta.json` file should look like this:

```json
{
  "title": "Project Title",
  "description": "A short description of your project",
  "image": "path/to/preview.png"
}
```

---

## ⚙️ Contribution Steps

1. **Fork this repository**

   ```bash
   git fork https://github.com/DevVerse.git
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-username>/DevVerse.git
   ```

3. **Navigate into the repo**

   ```bash
   cd DevVerse
   ```

4. **Create a new branch**

   ```bash
   git checkout -b add-my-project
   ```

5. **Add your project**

   * Create a new folder inside `/projects/` with your project name.
   * Add your files (`index.html`, `style.css`, `script.js`, etc.).
   * Include a `meta.json` and a project-level `README.md`.

6. **Update `pages.json`**
   Add your project entry to the JSON list. Ensure the name is **unique**.

7. **Commit and push**

   ```bash
   git add .
   git commit -m "Added my awesome mini project 🚀"
   git push origin add-my-project
   ```

8. **Submit a Pull Request (PR)**

   * Go to your fork on GitHub.
   * Click **Compare & Pull Request**.
   * Describe your project and changes clearly.

---

## 🧩 Code Guidelines

* Keep your code **clean, readable, and commented**.
* Use **semantic HTML**, well-structured CSS, and efficient JS.
* Ensure all assets (images, scripts) are inside your project folder.
* Avoid using copyrighted or external paid resources.

---

## 🧾 Pull Request Process

* Every PR will be reviewed by maintainers.
* If everything looks good, your PR will be merged. 🎉
* Once merged, your name will appear in the **Contributors** section of the README automatically (via [all-contributors bot](https://allcontributors.org)).

---

## 🌱 Community Standards

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/).
Be respectful, supportive, and collaborative. This is a safe place for all developers. 💙

---

### 💡 Tip

If you’re new to open source, check out:

* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
* [First Contributions Guide](https://github.com/firstcontributions/first-contributions)

---

Thank you for helping us build **DevVerse** —

> “Where ideas meet code, and developers grow together.” 🚀
