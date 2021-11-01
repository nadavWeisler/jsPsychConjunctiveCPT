/*
 * Example plugin template
 */
class Shape {
  constructor(color, shape, obj) {
    this.color = color;
    this.shape = shape;
    this.obj = obj;
  }
}

class Shapes {
  static getSquere(width, height, color) {
    let squere = document.createElement('canvas');
    squere.id = "squere";
    squere.style.width = width + "cm";
    squere.style.height = height + "cm";
    squere.style.background = color;
    squere.style.zIndex = 2;
    squere.style.position = "absolute";
    squere.style.display = "none";
    return new Shape(color, "squere", squere);
  }

  static getCircle(width, height, color) {
    let circle = document.createElement('canvas');
    circle.id = "circle";
    circle.style.width = width + "cm";
    circle.style.height = height + "cm";
    circle.style.borderRadius = "50%";
    circle.style.background = color;
    circle.style.zIndex = 2;
    circle.style.position = "absolute";
    circle.style.display = "none";
    return new Shape(color, "circle", circle);
  }

  static getTriangle(width, height, color) {
    let triangle = document.createElement('canvas');
    triangle.id = "triangle";
    triangle.style.width = 0;
    triangle.style.height = 0;
    triangle.style.borderLeft = width / 2 + "cm solid transparent";
    triangle.style.borderRight = width / 2 + "cm solid transparent";
    triangle.style.borderBottom = height + "cm solid " + color;
    triangle.style.zIndex = 2;
    triangle.style.position = "absolute";
    triangle.style.display = "none";
    return new Shape(color, "triangle", triangle);
  }

  static getTriangleDown(width, height, color) {
    let triangle = document.createElement('canvas');
    triangle.style.width = 0;
    triangle.style.height = 0;
    triangle.style.borderLeft = width / 2 + "cm solid transparent";
    triangle.style.borderRight = width / 2 + "cm solid transparent";
    triangle.style.borderTop = height + "cm solid " + color;
    triangle.style.zIndex = 2;
    triangle.style.position = "absolute";
    triangle.style.display = "none";
    return new Shape(color, "triangle", triangle);
  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getAllStimulus(trials_count, stimulus_percentage, stimulus) {
  return new Array(trials_count * (stimulus_percentage / 100)).fill(stimulus);
}

function getDistractors(trials_count, percentage, distractors) {
  let all_distractors = [];
  let one_distractor = [];
  for (var dis in distractors) {
    one_distractor = new Array(Math.floor(trials_count * (percentage / 100) / distractors.length)).fill(distractors[dis]);
    all_distractors.push(...one_distractor);
  }
  for (var i = 0; i < Math.abs((trials_count * (percentage / 100)) - all_distractors.length); i++) {
    all_distractors.push(distractors[i]);
  }
  return all_distractors;
}

function getAllTrials (trials_count, stimulus_percentage, stimulus, same_color_percentage, same_color_distractors, same_shape_percentage, same_shape_distractors, other_percentage, other_distractors) {
  let all_trials = getAllStimulus(trials_count, stimulus_percentage, stimulus).concat(
    getDistractors(trials_count, same_color_percentage, same_color_distractors),
    getDistractors(trials_count, same_shape_percentage, same_shape_distractors),
    getDistractors(trials_count, other_percentage, other_distractors)
  );
  return shuffle(all_trials);
}

function getAllIni (trial_count, inter_stimulus_interval_times) {
  let all_ini = [];
  for (var i = 0; i < inter_stimulus_interval_times.length; i++) {
    one_ini = new Array(Math.floor(trial_count / inter_stimulus_interval_times.length)).fill(inter_stimulus_interval_times[i]);
    all_ini.push(...one_ini);
  }
  return shuffle(all_ini);
}

function downloadCSV(data) {
  let csv = data;
  let link = document.createElement('a');
  document.body.innerHTML += '<div style="position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;"></div>';
  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  let exportData = encodeURI(csv);
  link.setAttribute('href', exportData);
  link.setAttribute('download', 'experiment_results.csv');
  link.innerText += "download";
  document.body.innerHTML = '<h1 align="center">' + link.outerHTML + '</h1>';
  link.click();
}

jsPsych.plugins["conjunctive-cpt"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'conjunctive-cpt',
    description: '',
    parameters: {
      visUnit: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Visual unit size',
        default: 1,
        description: "Multiplier for manual stimulus size asjustment. Should be\
           depreceated with new jsPsych's native solution."
      },
      colorOpts: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'Color palette',
        default: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
        ],
        description: "Colors for the Mondrian"
      },
      timing_response: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Timing response',
        default: 0,
        description: "Maximum time duration allowed for response"
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Response choices',
        default: [32]
      },
      stimulus_vertical_flip: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Vertical flip stimulus',
        default: 0,
      },
      stimulus_side: {
        type: jsPsych.plugins.parameterType.INT,
        default: -1,
        description: "Stimulus side: 1 is right, 0 is left. -1 is random"
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 100,
        description: "Duration of stimulus presentation 100MS by default"
      },
      inter_stimulus_interval_times: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: [1000, 1500, 2000, 2500],
        description: "interval between stimuli times"
      },
      stimulus_shape: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "squere",
        description: "Stimulus shape: squere, circle, triangle"
      },
      other_shapes: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: ["circle", "star"],
        description: "Other shapes to be presented"
      },
      stimulus_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 30,
        description: "Percentage of the screen to show stimulus"
      },
      stimulus_color: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: '#0000FF',
        description: "Color of the stimulus"
      },
      other_colors: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: ['#FF0000', '#00FF00', '#FF00FF', '#00FFFF'],
        description: "Other colors to be used"
      },
      same_color_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 17.5,
        description: "Percentage of the screen to show the same color"
      },
      same_shape_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 17.5,
        description: "Duration of the same shape presentation"
      },
      stimulus_min_height: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.4,
        description: "Minimum height of the stimulus in cm"
      },
      stimulus_max_height: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.8,
        description: "Maximum height of the stimulus in cm"
      },
      stimulus_min_width: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.8,
        description: "Minimum width of the stimulus in cm"
      },
      stimulus_max_width: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.9,
        description: "Maximum width of the stimulus in cm"
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 10,
        description: "Trial duration in milliseconds"
      },
      trials_count: {
        type: jsPsych.plugins.parameterType.INT,
        default: 320,
        description: "Number of trials"
      }
    }
  }

  jsPsych.pluginAPI.registerPreload('conjunctive-cpt', 'stimulus', 'image');

  plugin.trial = function (display_element, trial) {
    let stimulus;
    let other_distractors = [];
    let same_color_distractors = [];
    let same_shape_distractors = [];
    let current_time = 0;
    switch (trial.stimulus_shape) {
      case "squere":
        stimulus = Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "circle":
        stimulus = Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "triangle":
        stimulus = Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      default:
        stimulus = Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
    }

    other_percentage = 100 - trial.stimulus_percentage - trial.same_shape_percentage - trial.same_color_percentage;
    const all_trials = getAllTrials(trial.trials_count, trial.stimulus_percentage, stimulus, trial.same_color_percentage, same_color_distractors, trial.same_shape_percentage, same_shape_distractors, other_percentage, other_distractors);
    const all_ini = getAllIni(all_trials.length, trial.inter_stimulus_interval_times);

    // Clear previous
    display_element.innerHTML = '';

    for (var index in all_trials) {
      display_element.append(all_trials[index].obj);
    }

    setTimeout(function () {

      // Hide mouse
      var stylesheet = document.styleSheets[0];
      // stylesheet.insertRule("* {cursor: none;}", stylesheet.cssRules.length);

      // this array holds handlers from setTimeout calls
      // that need to be cleared if the trial ends early
      var setTimeoutHandlers = [];

      // store response
      var response = {
        rt: [],
        key: -1
      };

      let current_data = {}
      const startTime = new Date().getTime() / 1000;
      let hidden = true;

      // function to end trial when it is time
      var end_trial = function () {

        downloadCSV(jsPsych.data.get().csv(), "data.csv");

        // move on to the next trial
        setTimeout(function () {
          jsPsych.data.write(data);
          //jsPsych.finishTrial(trial_data);
        }, 10);
      };

      // function to handle responses by the subject
      const after_response = function (info) {
        console.log(info);
        // only record the first response
        if (response.key == -1) {
          response = info;
        }

        current_time = (new Date().getTime() / 1000) - startTime;

        let current_data = {
          "current_time": current_time,
          "shape": all_trials[Math.floor(index)].shape,
          "color": all_trials[Math.floor(index)].color,
          "cpt_index": Math.floor(index),
          "response": info.key,
        }

        jsPsych.data.write(current_data);
      };

      const start_trial = function () {
        // start the response listener
        if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: true,
            allow_held_key: false
          });
        } 
        try {
          ccpt();
        } catch (e) {
          console.log("Catch: " + e);
          end_trial();
        }
      };

      function ccpt (index = 0) {
        current_time = (new Date().getTime() / 1000) - startTime;
        if (hidden) {
          current_data = {
            "type": "jspsych-conjunctive-cpt",
            "current_time": current_time,
            "shape": all_trials[Math.floor(index)].shape,
            "color": all_trials[Math.floor(index)].color,
            "cpt_index": Math.floor(index),
          }
        } else {
          current_data = {
            "type": "jspsych-conjunctive-cpt",
            "current_time": current_time,
            "inter_stimulus_interval_time": all_ini[Math.floor(index)],
            "inter_stimulus_interval_index": Math.floor(index),
          }
        }
        jsPsych.data.write(current_data);
        hidden = !hidden;
        all_trials[Math.floor(index)].obj.style.display = hidden ? "none" : "initial";
        if (current_time < 10000 && index < all_trials.length) {
          setTimeout(() => ccpt(index += 0.5),
            hidden ? all_ini[Math.floor(index)] : trial.stimulus_duration);
        } else {
          end_trial();
        }
      }

      start_trial();
    }, 100);
  };

  return plugin;
})();
