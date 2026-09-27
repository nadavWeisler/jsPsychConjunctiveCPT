# Conjunctive Continuous Performance Task jsPsych plugin

A [jsPsych](https://www.jspsych.org/) 6 plugin and example timeline for the Conjunctive Continuous Performance Task (CCPT). In this sustained-attention task the participant responds only to one shape–color conjunction and withholds responses to the other combinations.

The procedure follows Shalev, L., Ben-Simon, A., Mevorach, C., Cohen, Y., & Tsal, Y. (2011). Conjunctive Continuous Performance Task (CCPT)—A pure measure of sustained attention. *Neuropsychologia, 49*(9), 2584–2591. <https://doi.org/10.1016/j.neuropsychologia.2011.05.006>

## What is in this repository

- `jspsych/plugins/jspsych-conjunctive-cpt.js` registers the `conjunctive-cpt` plugin. The file is adapted from jsPsych’s image-keyboard-response plugin (Josh de Leeuw).
- `task.js` builds the example timeline: a red square is the target (`isStimulus: true`); other shapes in red, and squares in other colors, are non-targets.
- `images/cpt/` holds the shape–color stimuli (square, circle, triangle, and star, each in red, yellow, green, and blue).
- `images/validations/` holds the correct and incorrect feedback images.
- `jspsych/` is a vendored copy of jsPsych 6. `lib/` holds other third-party libraries used alongside this example.

## Use with jsPsych

Load jsPsych 6, this plugin, and the stylesheet. Trials use `type: "conjunctive-cpt"`.

```html
<script src="jspsych/jspsych.js"></script>
<script src="jspsych/plugins/jspsych-conjunctive-cpt.js"></script>
<link href="css/jspsych.css" rel="stylesheet" type="text/css">
```

```javascript
var trial = {
  type: "conjunctive-cpt",
  stimulus: "images/cpt/square_red.png",
  isStimulus: true,
  choices: [32],
  stimulus_duration: 100,
  trial_duration: 1100,
  response_ends_trial: false,
  validate: true,
  validationCorrect: "images/validations/correct.png",
  validationIncorrect: "images/validations/incorrect.png"
};

jsPsych.init({
  timeline: [trial]
});
```

Serve the repository over HTTP so the stimulus images can load.

`task.js` is the bundled example. It shuffles the list returned by `createCpt(97, 56, 320)`, runs that timeline in fullscreen, and downloads `data.csv` when the experiment finishes. In that timeline the stimulus stays on screen for 100 ms. The trial then remains open for a further 1000, 1500, 2000, or 2500 ms. The response key is the space bar (key code 32), and a keypress does not end the trial. Feedback images are shown (`validate: true`).

`exp.html` is the page that loads this timeline. Its script and stylesheet paths use a `./static/` layout, as in a psiTurk project. In this repository those files are at `jspsych/`, `css/jspsych.css`, and `task.js`.

One trial constructed inside `createCpt` sets `type` to `image-cpt`. The plugin registered here is `conjunctive-cpt`.

### Parameters the trial uses

| Parameter | Role |
| --- | --- |
| `stimulus` | Image path to display. |
| `isStimulus` | Whether the trial is a target. Chooses the feedback image when `validate` is true. Default `true`. |
| `choices` | Allowed response key codes. Default is all keys. The example uses `[32]` (space). |
| `stimulus_duration` | Milliseconds until the stimulus is hidden. |
| `trial_duration` | Milliseconds until the trial ends. |
| `response_ends_trial` | When true, a valid keypress ends the trial. Default `true`. The example sets `false`. |
| `prompt` | Optional HTML shown with the stimulus. Default `null`. |
| `validate` | When true, show the feedback images. Default `false`. |
| `validationCorrect` | Feedback image after a response on a target trial. |
| `validationIncorrect` | Feedback image after a response on a non-target trial, and after a missed target at the end of the trial. |

The plugin declares `width` and `height` (both default `"75.6"`). The trial function leaves those values unused.

Each finished trial stores `rt`, `key_press`, and `is_stimulus`. The saved `is_stimulus` value is taken from `trial.is_stimulus`. Feedback uses `trial.isStimulus`, which is the property set by `task.js`.

## Citation

Cite this software with [`CITATION.cff`](CITATION.cff). Zenodo assigns a DOI when it archives a GitHub release of this repository. Add that DOI to `CITATION.cff` after the archive exists.

Also cite Shalev et al. (2011) when reporting CCPT results.

## License

Original code in this repository is under the MIT License. See [`LICENSE`](LICENSE).

Upstream jsPsych (Josh de Leeuw and contributors) is MIT-licensed; this repository vendors a copy under `jspsych/` and does not add a separate upstream license file. Files under `lib/` and parts of `css/` are third-party (including jQuery, Bootstrap, Underscore, D3, lz-string, and GreenSock TweenMax / CustomEase) and keep the license notices in those files.
