const body = document.querySelector("body");
const makeASearchText = document.querySelector(".make-a-search");
const wordDefinitionArticle = document.querySelector(".word-definition");
const wordHead = document.querySelector(".article-sub-head h1");
const playBtn = document.querySelector(".play-audio");
const wordTranscription = document.querySelector(".article-sub-head p");
const pauseNPlayIcon = document.querySelector(".article-head i");
const nounSection = document.querySelector("#noun");
const wordMeaningsNoun = document.querySelector("#noun ul");
const wordSynonymsUl = document.querySelector(".synonyms-list");
const wordSynonymsLi = Array.from(document.querySelectorAll(".synonym-li"));
const verbSection = document.querySelector("#verb");
const wordMeaningsVerb = document.querySelector("#verb ul");
const blockquoteSection = document.querySelector("blockquote");
const blockQuote = document.querySelector("blockquote ul");

const select = document.querySelector("select");
const input = document.querySelector("#search-word");
const btnSubmit = document.querySelector("#submit-search");
const themeToggle = document.getElementById("themeToggle");

wordDefinitionArticle.classList.add("hidden");

// Font selection
// Function for selection of  fonts
function selectFont(fontFamily) {
  body.style.fontFamily = `${fontFamily}`;
}

// Selection of fonts
select.addEventListener("change", (e) => {
  selectFont(select.value);
  localStorage.setItem("font", `${select.value}`);
});

if (localStorage.getItem("font") !== null) {
  select.value = localStorage.getItem("font");
  selectFont(localStorage.getItem("font"));
} //   when page reloads it gives the page the predefined fonts
// End of font selection

// Theme toogling
// Toogling of themes(dark and white theme)
themeToggle.addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode");
  if (themeToggle.checked) {
    localStorage.setItem("checked", "true");
  } else {
    localStorage.removeItem("checked");
  }
});

if (localStorage.getItem("checked") !== null) {
  themeToggle.checked = true;
  document.body.classList.toggle("dark-mode");
} //   when page reloads it gives the page the predefined theme
// End of theme toogling

// APi part
let dataWeNeed;
let audioLink;
let ourAudio;
// Asynchronous code
// Fetching the data
function getData(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No result for '${word}'`);
        }
      }
      return response.json();
    })
    .then((data) => {
      dataWeNeed = data[0];
      console.log(dataWeNeed);
      console.log(data);
      audioLink = dataWeNeed.phonetics.find(
        (e) => e.audio.trim() !== ""
      )?.audio;
      ourAudio = new Audio(audioLink);
      wordHead.textContent = dataWeNeed.word;
      wordTranscription.textContent = dataWeNeed.phonetic;
      makeASearchText.classList.add("hidden");
      wordDefinitionArticle.classList.remove("hidden");

      const nounObj = dataWeNeed.meanings.find(
        (obj) => obj.partOfSpeech === "noun"
      );

      wordMeaningsNoun.innerHTML = nounObj?.definitions
        .map((each) => `<li>${each.definition}</li>`)
        .join("");

      wordSynonymsUl.innerHTML = nounObj?.synonyms
        .filter((each, i) => i < 3)
        .map(
          (each) =>
            `<li class="synonym-li">
                    <p class="synonym-link" >${each}</p>

                </li>`
        )
        .join("");
      console.log(wordSynonymsLi);
      wordSynonymsLi.forEach((each) => {
        console.log(each);
        each.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("well");
          console.log(e.target);
        });
      });
      if (nounObj?.synonyms[0] === undefined) {
        wordSynonymsUl.innerHTML = `${dataWeNeed.word} has no synonym`;
        console.log(true);
      }

      const verbObj = dataWeNeed.meanings.find(
        (obj) => obj.partOfSpeech === "verb"
      );
      wordMeaningsVerb.innerHTML = verbObj?.definitions
        .map((each) => `<li>${each.definition}</li>`)
        .join("");
      blockQuote.innerHTML = verbObj?.definitions
        .map((each) => {
          if (each.example) {
            return `<li>"${each.example}"</li>`;
          }
        })
        .join("");
      if (!verbObj) {
        [verbSection, blockquoteSection].forEach((each) =>
          each.classList.add("hidden")
        );
      } else {
        [verbSection, blockquoteSection].forEach((each) =>
          each.classList.remove("hidden")
        );
      }
    })
    .catch((err) => {
      makeASearchText.innerHTML = `Oops, ${err.message}`;
      console.error("Oops error", err.message);
    });
}

// Array.from(document.querySelectorAll(".synonyms-list a")).forEach((each) =>
//   each.addEventListener("click", (e) => e.preventDefault)
// );

playBtn.addEventListener("click", (e) => {
  if (audioLink) {
    ourAudio.play();
  }
  ourAudio.addEventListener("play", () => {
    pauseNPlayIcon.classList.replace("fa-play", "fa-pause");
  });
  ourAudio.addEventListener("ended", () => {
    pauseNPlayIcon.classList.replace("fa-pause", "fa-play");
  });
});

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value.trim() === "") {
    alert("egbon please do the needful");
    makeASearchText.textContent =
      "Please input actual words into the search bar.";
    return;
  }
  getData(input.value);
});
