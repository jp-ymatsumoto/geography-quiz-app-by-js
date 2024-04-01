"use strict";

/* ============================================================
  基本データ
============================================================ */

/** すべての問題データ */
const data = [
  // 地理に関する問題
  {
    question: "日本で一番面積の大きい都道府県は？",
    options: ["北海道", "岩手", "福島", "長野"],
    correct: "北海道",
  },
  {
    question: "日本で一番人口の多い都道府県は？",
    options: ["北海道", "東京都", "岩手県", "広島県"],
    correct: "東京都",
  },
  {
    question: "日本で一番人口密度が高い都道府県は？",
    options: ["北海道", "東京都", "岩手県", "広島県"],
    correct: "東京都",
  },
  {
    question: "日本で１番目に高い山は？",
    options: ["富士山", "北岳", "阿蘇山", "立山"],
    correct: "富士山",
  },
  {
    question: "日本で２番目に高い山は？",
    options: ["富士山", "北岳", "阿蘇山", "立山"],
    correct: "北岳",
  },
  {
    question: "日本で１番目に長い川は？",
    options: ["利根川", "信濃川", "石狩川", "四万十川"],
    correct: "信濃川",
  },
  {
    question: "日本で２番目に長い川は？",
    options: ["利根川", "信濃川", "石狩川", "四万十川"],
    correct: "利根川",
  },
  {
    question: "日本で１番目に大きい湖は？",
    options: ["琵琶湖", "浜名湖", "サロマ湖", "霞ヶ浦"],
    correct: "琵琶湖",
  },
  {
    question: "日本で２番目に大きい湖は？",
    options: ["琵琶湖", "浜名湖", "サロマ湖", "霞ヶ浦"],
    correct: "霞ヶ浦",
  },
  {
    question: "日本で一番人口の少ない都道府県は？",
    options: ["岩手", "秋田", "鳥取", "島根"],
    correct: "鳥取",
  },
];

/** 出題する問題数 */
const QUESTION_LENGTH = 5;
// 解答時間(ms)
const ANSWER_TIME_MS = 10000;
// インターバルの時間(ms)
const INTERVAL_TIME_MS = 10;

/** 出題する問題 */
let questions = [];
/** 出題する問題のインデックス */
let questionIndex = 0;
/** 正解数 */
let correctCount = 0;
// インターバルID
let intervalId = null;
// 解答中の経過時間
let elapsedTime = 0;

/* ============================================================
  要素一覧
============================================================ */

/** クイズのスタート画面 */
const startPage = document.getElementById("startPage");
/** クイズの問題画面 */
const questionPage = document.getElementById("questionPage");
/** クイズの結果画面 */
const resultPage = document.getElementById("resultPage");

/** 「プレイする」ボタンのbutton要素 */
const startButton = document.getElementById("startButton");

/** 問題番号のdiv要素 */
const questionNumber = document.getElementById("questionNumber");
/** 問題文のdiv要素 */
const questionText = document.getElementById("questionText");
/** すべての選択肢のbutton要素 */
const optionButtons = document.querySelectorAll("#questionPage button");
// 問題の進行状況のprogress要素
const questionProgress = document.getElementById("questionProgress");

/** 正解・不正解のダイアログのdialog要素 */
const dialog = document.getElementById("dialog");
/** 問題結果のdiv要素 */
const questionResult = document.getElementById("questionResult");
/** 「次の問題へ」ボタンのbutton要素 */
const nextButton = document.getElementById("nextButton");

/** クイズ結果のdiv要素 */
const resultMessage = document.getElementById("resultMessage");
/** 「スタート画面に戻る」ボタンのbutton要素 */
const backButton = document.getElementById("backButton");

/* ============================================================
  処理
============================================================ */

startButton.addEventListener("click", clickStartButton);

for (let i = 0; i < optionButtons.length; i++) {
  optionButtons[i].addEventListener("click", clickOptionButton);
}

nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click", clickBackButton);

/* ============================================================
  関数一覧
============================================================ */

/**
 * 出題する問題をランダムに生成する
 * @return {array} 出題する問題
 */
function getRandomQuestions() {
  // 出題する問題のインデックスリスト
  const questionIndexList = [];

  // 出題数になるまでランダムなインデックスを作成する
  while (questionIndexList.length !== QUESTION_LENGTH) {
    // ランダムなインデックスを作成する
    const index = Math.floor(Math.random() * data.length);
    // インデックスリストに含まれていない場合にインデックスを追加する
    if (!questionIndexList.includes(index)) {
      questionIndexList.push(index);
    }
  }

  // 問題データから出題する問題を取得する
  const questionList = questionIndexList.map((index) => data[index]);

  return questionList;
}

/**
 * スタート画面の表示を切り替える
 * @param {boolean} isShow 表示するかどうか
 */
function switchStartPage(isShow) {
  if (isShow) {
    if (startPage.classList.contains("hidden")) {
      startPage.classList.remove("hidden");
    }
  } else {
    if (!startPage.classList.contains("hidden")) {
      startPage.classList.add("hidden");
    }
  }
}

/**
 * 問題画面の表示を切り替える
 * @param {boolean} isShow 表示するかどうか
 */
function switchQuestionPage(isShow) {
  if (isShow) {
    if (questionPage.classList.contains("hidden")) {
      questionPage.classList.remove("hidden");
    }
  } else {
    if (!questionPage.classList.contains("hidden")) {
      questionPage.classList.add("hidden");
    }
  }
}

/**
 * 結果画面の表示を切り替える
 * @param {boolean} isShow 表示するかどうか
 */
function switchResultPage(isShow) {
  if (isShow) {
    if (resultPage.classList.contains("hidden")) {
      resultPage.classList.remove("hidden");
    }
  } else {
    if (!resultPage.classList.contains("hidden")) {
      resultPage.classList.add("hidden");
    }
  }
}

/**
 * 選択肢ボタンの状態を切り替える
 * @param {boolean} isEnabled 有効にするかどうか
 */
function setOptionButtons(isEnabled = true) {
  if (isEnabled) {
    optionButtons.forEach((button) => {
      if (button.hasAttribute("disabled")) {
        button.removeAttribute("disabled");
      }
    });
  } else {
    optionButtons.forEach((button) => {
      if (!button.hasAttribute("disabled")) {
        button.setAttribute("disabled", "disabled");
      }
    });
  }
}

/**
 * 問題を設定する
 */
function setQuestion() {
  const question = questions[questionIndex];
  // 問題番号を表示する
  questionNumber.innerText = `第 ${questionIndex + 1} 問`;
  // 問題文を表示する
  questionText.innerText = question.question;
  // 選択肢を表示する
  for (let i = 0; i < optionButtons.length; i++) {
    optionButtons[i].innerText = question.options[i];
  }
}

/**
 * クイズをリセットする
 */
function resetQuiz() {
  // 出題する問題を取得する
  questions = getRandomQuestions();
  // 出題する問題のインデックスをリセットする
  questionIndex = 0;
  // 正解数をリセットする
  correctCount = 0;
  // インターバルIDをリセットする
  intervalId = null;
  // 解答中の経過時間をリセットする
  elapsedTime = 0;

  // 選択肢ボタンを有効化する
  setOptionButtons(true);
}

/**
 * 最後の問題かどうかを判定する
 */
function isLastQuestion() {
  return questionIndex + 1 === QUESTION_LENGTH;
}

/**
 * 結果画面を設定する
 */
function setResult() {
  // 正解率を計算する
  const accuracyRate = Math.floor((correctCount / QUESTION_LENGTH) * 100);
  // 正解率を表示する
  resultMessage.innerText = `正解率: ${accuracyRate}%`;
}

/**
 * 解答の計測を開始する
 */
function startProgress() {
  // インターバルを開始する
  intervalId = setInterval(() => {
    // 経過時間を計算する
    const progress = (elapsedTime / ANSWER_TIME_MS) * 100;
    // 経過時間を表示する
    questionProgress.value = progress;
    if (ANSWER_TIME_MS <= elapsedTime) {
      stopProgress();
      questionTimeOver();
      return;
    }
    elapsedTime += INTERVAL_TIME_MS;
  }, INTERVAL_TIME_MS);
}

/**
 * 解答の計測を停止する
 */
function stopProgress() {
  if (intervalId !== null) {
    // インターバルを停止する
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * 解答時間をオーバーした時の処理
 */
function questionTimeOver() {
  // 時間切れの場合は不正解とする
  questionResult.innerText = "✖️";

  // 最後の問題かどうかを判定する
  if (isLastQuestion()) {
    nextButton.innerText = "結果を見る";
  } else {
    nextButton.innerText = "次の問題へ";
  }

  // 正解・不正解のダイアログを表示する
  dialog.showModal();
}

/**
 * クイズを開始するイベントハンドラー
 */
function clickStartButton() {
  // クイズをリセットする
  resetQuiz();
  // 問題を設定する
  setQuestion();
  // 解答の計測を開始する
  startProgress();
  // スタート画面を非表示にする
  switchStartPage(false);
  // 結果画面を非表示にする
  switchResultPage(false);
  // 問題画面を表示する
  switchQuestionPage(true);
}

/**
 * 選択肢をクリックした時のイベントハンドラー
 * @param {object} event イベントオブジェクト
 */
function clickOptionButton(event) {
  // 解答の計測を停止する
  stopProgress();
  // すべての選択肢ボタンを無効化する
  setOptionButtons(false);

  // 選択肢のテキストを取得する
  const optionText = event.target.innerText;
  // 正解のテキストを取得する
  const correctText = questions[questionIndex].correct;

  // 正解かどうかを判定する
  if (optionText === correctText) {
    questionResult.innerText = "⭕️";
    correctCount++;
  } else {
    questionResult.innerText = "✖️";
  }

  // 最後の問題かどうかを判定する
  if (isLastQuestion()) {
    nextButton.innerText = "結果を見る";
  } else {
    nextButton.innerText = "次の問題へ";
  }

  // 正解・不正解のダイアログを表示する
  dialog.showModal();
}

/**
 * 「次の問題へ」ボタンをクリックした時のイベントハンドラー
 */
function clickNextButton() {
  if (isLastQuestion()) {
    // 結果画面に正解率を設定する
    setResult();
    // 正解・不正解のダイアログを閉じる
    dialog.close();
    // スタート画面を非表示にする
    switchStartPage(false);
    // 問題画面を表示する
    switchQuestionPage(false);
    // 結果画面を非表示にする
    switchResultPage(true);
    console.log(questionIndex + 1, correctCount, QUESTION_LENGTH);
  } else {
    // 問題のインデックスを更新する
    questionIndex++;
    // 問題を設定する
    setQuestion();
    // 選択肢ボタンを有効化する
    setOptionButtons(true);
    // インターバルIDをリセットする
    intervalId = null;
    // 解答時間をリセットする
    elapsedTime = 0;
    // 正解・不正解のダイアログを閉じる
    dialog.close();
    // 解答の計測を開始する
    startProgress();
  }
}

/**
 * 「スタート画面に戻る」ボタンをクリックした時のイベントハンドラー
 */
function clickBackButton() {
  // 問題画面を表示する
  switchQuestionPage(false);
  // 結果画面を非表示にする
  switchResultPage(false);
  // スタート画面を非表示にする
  switchStartPage(true);
}
