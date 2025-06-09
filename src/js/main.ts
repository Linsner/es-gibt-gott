// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Popover } from 'bootstrap';
import { Marked } from 'marked';

// set systems color theme
document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))

interface Content {
  chapters: Array<Chapter>;
}

interface Chapter {
  title: string;
  sections: Array<Section>;
}

interface Section {
  title: string;
}

class StartPage {

  chapterContent: HTMLElement;
  chapterText: HTMLElement;
  welcome: HTMLElement;
  chapterNo: number;
  sectionNo: number;
  content: Content;
  chapterTitle: HTMLElement;

  constructor() {
    document.getElementById('btnSwitch')?.addEventListener('click', () => {
      this.onThemeButtonClicked();
    });

    for (const el of document.getElementsByClassName('left-nav-button')) {
      el.addEventListener('click', () => {
        this.goLeft();
      });
    }

    for (const el of document.getElementsByClassName('right-nav-button')) {
      el.addEventListener('click', () => {
        this.goRight();
      });
    }

    for (const el of document.getElementsByClassName('up-nav-button')) {
      el.addEventListener('click', () => {
        this.goUp();
      });
    }

    this.welcome = document.getElementById("welcome")!;
    this.chapterTitle = document.getElementById("chapter-title")!;
    this.chapterContent = document.getElementById("chapter-content")!;
    this.chapterText = document.getElementById("chapter-text")!;
    let cards = document.getElementsByClassName("chapter-card");
    for (const node of cards) {
      node.addEventListener("click", async (element) => {
        this.onChapterCardClicked((element as any).target);
      });
    }

    this.loadContent();
  }

  private async loadContent() {
    var contentResp = await fetch("/lectures/content.json", { method: 'GET' })
    this.content = JSON.parse(await contentResp.text()) as Content;
  }

  private onThemeButtonClicked() {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'light')
    }
    else {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    }
  }

  private async onChapterCardClicked(element: HTMLElement) {
    let chapter = element.getAttribute("data-chapter");
    this.goTo(Number(chapter), 1);
  }

  private goLeft() {
    this.goTo(this.chapterNo, this.sectionNo - 1);
  }

  private goRight() {
    this.goTo(this.chapterNo, this.sectionNo + 1);
  }

  private goUp() {
    this.welcome.classList.remove("hidden");
    this.chapterContent.classList.add("hidden");
  }

  private async goTo(chapterNo: number, sectionNo: number) {
    if (chapterNo < 1 || chapterNo > this.content.chapters.length) {
      this.goUp();
      return;
    }

    let chapter = this.content.chapters[chapterNo - 1];

    if (sectionNo < 1 || sectionNo > chapter.sections.length) {
      this.goUp();
      return;
    }

    try {
      let response = await fetch("/lectures/chapter-" + chapterNo + "-" + sectionNo + ".md", { method: 'GET' });
      let text = await response.text();
      let marked = new Marked();
      let parsed = await marked.parse(text);
      parsed = parsed.replaceAll("[Task]", '<i class="bi bi-lightbulb-fill text-warning"></i>');
      this.chapterText.innerHTML = parsed;
      this.welcome.classList.add("hidden");
      this.chapterContent.classList.remove("hidden");
      this.chapterTitle.innerText = chapter.title + " " + sectionNo + "/" + chapter.sections.length
      this.sectionNo = sectionNo;
      this.chapterNo = chapterNo;
    } catch (e) {
      console.error(e);
    }
  }
}

class Reading {
  chapter: number;
  section: number;

  constructor() {
    this.chapter = 1;
    this.section = 1;
  }
}

let reading = new Reading();
let startPage = new StartPage();

// Create an example popover
// document.querySelectorAll('[data-bs-toggle="popover"]')
//   .forEach(popover => {
//     new Popover(popover)
//   })