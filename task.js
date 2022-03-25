
// Shuffle list function
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Downlowd file function
function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Create CPT trials
function createCpt(cptCount, otherCount, trialCount) {
  const cptGaps = [1000, 1500, 2000, 2500];
  const cptDuration = 100;
  const size = 1.8;
  const stimulusShape = "square";
  const stimulusColor = "red";
  const otherShapes = ["circle", "triangle", "star"];
  const otherColors = ["yellow", "green", "blue"];

  let gaps = [];
  for (let i = 0; i < trialCount / 4; i++) {
    cptGaps.forEach(element => {
      gaps.push(element);
    });
  }

  gaps = shuffle(gaps);

  cpt_trials = [];
  for (let i = 0; i < cptCount; i++) {
    cpt_trials.push({
      type: "conjunctive-cpt",
      stimulus: "images/cpt/" + stimulusShape + "_" + stimulusColor + ".png",
      validationCorrect: "images/validations/correct.png",
      validationIncorrect: "images/validations/incorrect.png",
      isStimulus: true,
      response_ends_trial: false,
      trial_duration: gaps.pop() + cptDuration,
      stimulus_duration: cptDuration,
      choices: [32],
      validate: true
    });
  }

  for (let i = 0; i < (otherCount / 3); i++) {
    otherShapes.forEach(currentShape => {
      cpt_trials.push({
        type: "conjunctive-cpt",
        stimulus: "images/cpt/" + currentShape + "_" + stimulusColor + ".png",
        validationCorrect: "images/validations/correct.png",
        validationIncorrect: "images/validations/incorrect.png",
        isStimulus: false,
        response_ends_trial: false,
        trial_duration: gaps.pop() + cptDuration,
        stimulus_duration: cptDuration,
        choices: [32],
        validate: true
      });
    });
  }

  for (let i = 0; i < (otherCount / 3); i++) {
    otherColors.forEach(currentColor => {
      cpt_trials.push({
        type: "conjunctive-cpt",
        stimulus: "images/cpt/" + stimulusShape + "_" + currentColor + ".png",
        validationCorrect: "images/validations/correct.png",
        validationIncorrect: "images/validations/incorrect.png",
        isStimulus: false,
        response_ends_trial: false,
        trial_duration: gaps.pop() + cptDuration,
        stimulus_duration: cptDuration,
        choices: [32],
        validate: true
      });
    });
  }

  let count = trialCount - ((2 * otherCount) - cptCount);
  for (let i = 0; i < (otherShapes.length / 3); i++) {
    for (let j = 0; j < (otherColors.length / 3); j++) {
      cpt_trials.push({
        type: "image-cpt",
        stimulus: "images/cpt/" + otherShapes[i] + "_" + otherColors[j] + ".png",
        validationCorrect: "images/validations/correct.png",
        validationIncorrect: "images/validations/incorrect.png",
        isStimulus: false,
        trial_duration: gaps.pop() + cptDuration,
        stimulus_duration: cptDuration,
        response_ends_trial: false,
        choices: [32],
        validate: true
      });
      count--;
      if (count == 0) {
        break;
      }
    }
    if (count == 0) {
      break;
    }
  }

  return cpt_trials;
}

// create CPT timeline
let cptTimeline = []
shuffle(createCpt(97, 56, 320)).forEach(function (trial) {
  cptTimeline.push(trial);
});


// Init experiment
jsPsych.init({
  timeline: cptTimeline,
  fullscreen: true,
  on_finish: function () {
    download("data.csv", jsPsych.data.get().csv());
  }
});