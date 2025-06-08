// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Popover } from 'bootstrap';

import { Marked } from 'marked';

class User {

}

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })


document.getElementById('btnSwitch').addEventListener('click', () => {
  if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'light')
  }
  else {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  }
})

let chapterContentEl = document.getElementById("chapter-content");
let chapterTextEl = document.getElementById("chapter-text");
let cards = document.getElementsByClassName("chapter-card");

[].forEach.call(cards, function (node) {
  node.addEventListener("click", async (element) => {
    let chapter = element.target.getAttribute("data-chapter");

    try {
      let response = await fetch("/lectures/chapter-" + chapter + ".md", { method: 'GET' });
      let text = await response.text();
      let marked = new Marked();
      let parsed = marked.parse(text);
      // alert(parsed);
      chapterTextEl.innerHTML = parsed;
       chapterContentEl.classList.remove("hidden");
    } catch (e) {
      console.error(e);
    }


  });
});

function openChapter(chapter) {
  prompt(chapter);
}