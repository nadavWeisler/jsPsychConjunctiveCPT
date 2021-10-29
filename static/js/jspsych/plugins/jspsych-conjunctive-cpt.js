/*
 * Example plugin template
 */
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
        default: ['d', 'k']
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

  const getRandomInterStimulusIntervalsTime = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getSquere = (width, height, color) => {
    let squere = document.createElement('canvas');
    squere.id = "squere";
    squere.style.width = width + "cm";
    squere.style.height = height + "cm";
    squere.style.background = color;
    squere.style.zIndex = 2;
    squere.style.position = "absolute";
    squere.style.display = "none";
    return squere;
  }

  const getCircle = (width, height, color) => {
    let circle = document.createElement('canvas');
    circle.id = "circle";
    circle.style.width = width + "cm";
    circle.style.height = height + "cm";
    circle.style.borderRadius = "50%";
    circle.style.background = color;
    circle.style.zIndex = 2;
    circle.style.position = "absolute";
    circle.style.display = "none";
    return circle;
  }

  const getTriangle = (width, height, color) => {
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
    return triangle;
  }

  const getStar = (width, height, color) => {
    let star = document.createElement('canvas');
    star.id = "star";
    star.style.width = 0;
    star.style.height = 0;
    star.style.borderLeft = (width / 1.5) + "cm solid transparent";
    star.style.borderTop = height + "cm solid " + color;
    star.style.borderRight = (width / 1.5) + "cm solid transparent";
    star.style.borderRadius = "50%";
    star.style.zIndex = 2;
    star.style.position = "absolute";
    star.style.display = "none";
    return star;
  }


  const shuffle = (array) => {
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

  plugin.trial = function (display_element, trial) {
    let stimulus;
    let other_distractors = [];
    let same_color_distractors = []
    let same_shape_distractors = [];
    switch (trial.stimulus_shape) {
      case "squere":
        stimulus = getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "circle":
        stimulus = getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "triangle":
        stimulus = getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      default:
        stimulus = getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(getStar(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(getSquere(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
    }

    let all_trials = [];
    const all_stimulus = new Array(trial.trials_count * (trial.stimulus_percentage / 100)).fill(stimulus);
    let all_same_color_distractors = []
    for (var dis in same_color_distractors) {
      same_color_one_distractor = new Array(Math.floor(trial.trials_count * (trial.same_color_percentage / 100) / same_color_distractors.length)).fill(same_color_distractors[dis]);
      all_same_color_distractors.push(...same_color_one_distractor);
    }
    for (var i = 0; i < trial.trials_count * (trial.same_color_percentage / 100) - all_same_color_distractors.length; i++) {
      all_same_color_distractors.push(same_color_distractors[i]);
    }

    let all_same_shape_distractors = []
    for (var dis in same_shape_distractors) {
      console.log(trial.trials_count + " " + trial.same_shape_percentage + " " + same_shape_distractors.length);
      same_shape_one_distractor = new Array(Math.floor(trial.trials_count * (trial.same_shape_percentage / 100) / same_shape_distractors.length)).fill(same_shape_distractors[dis]);
      all_same_shape_distractors.push(...same_shape_one_distractor);
    }
    for (var i = 0; i < trial.trials_count * (trial.same_shape_percentage / 100) - all_same_shape_distractors.length; i++) {
      all_same_shape_distractors.push(same_shape_distractors[i]);
    }

    let all_other_distractors = []
    const other_percentage = 100 - trial.stimulus_percentage - trial.same_color_percentage - trial.same_shape_percentage;
    for (var dis in other_distractors) {
      other_one_distractor = new Array(Math.floor(trial.trials_count * (other_percentage / 100) / other_distractors.length)).fill(other_distractors[dis]);
      all_other_distractors.push(...other_one_distractor);
    }
    for (var i = 0; i < trial.trials_count * (other_percentage / 100) - all_other_distractors.length; i++) {
      all_other_distractors.push(other_distractors[i]);
    }

    all_trials = all_stimulus.concat(all_same_color_distractors, all_same_shape_distractors, all_other_distractors);

    // Shuffle the stimuli
    all_trials = shuffle(all_trials);

    all_ini = [];
    for (var i = 0; i < trial.inter_stimulus_interval_times.length; i++) {
      one_ini = new Array(Math.floor(all_trials.length / trial.inter_stimulus_interval_times.length)).fill(trial.inter_stimulus_interval_times[i]);
      all_ini.push(...one_ini);
    }

    all_ini = shuffle(all_ini);
    // Clear previous
    display_element.innerHTML = '';

    for (var index in all_trials) {
      display_element.append(all_trials[index]);
    }

    setTimeout(function () {

      // Start timing for within trial ITI
      var startCompute = Date.now();

      // Hide mouse
      var stylesheet = document.styleSheets[0];
      // stylesheet.insertRule("* {cursor: none;}", stylesheet.cssRules.length);

      if (trial.stimulus_side < 0) {
        stimulus_side = Math.round(Math.random());
      } else {
        stimulus_side = trial.stimulus_side;
      }

      // this array holds handlers from setTimeout calls
      // that need to be cleared if the trial ends early
      var setTimeoutHandlers = [];

      // store response
      var response = {
        rt: [],
        key: -1
      };

      // function to end trial when it is time
      var end_trial = function () {

        // gather the data to store for the trial
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "stimulus_side": stimulus_side,
          "key_press": response.key,
          "acc": (response.key == 68 & stimulus_side == 0) |
            (response.key == 75 & stimulus_side == 1),
          'animation_performance': mond,
          'bProblem': bProblem,
          'sProblem': sProblem,
          'trial_began': trial_began
        };

        console.log("END");

        // move on to the next trial
        setTimeout(function () {
          jsPsych.finishTrial(trial_data);
        }, 10);

      };

      const startTime = new Date().getTime() / 1000;
      let hidden = true;
      let checked = false;

      // function to handle responses by the subject
      var after_response = function (info) {
        console.log(info)
        checked = true;
        // only record the first response
        if (response.key == -1) {
          response = info;
        }

        end_trial();
      };

      var start_trial = function () {
        // start the response listener
        if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
          });
        }
        ccpt();
      };

      var t = getStar(4, 4, trial.stimulus_color);
      t.style.display = "initial";
      display_element.append(t);

      const ccpt = (index = 0) => {
        hidden = !hidden;
        all_trials[Math.floor(index)].style.display = hidden ? "none" : "initial";
        console.log(all_trials[Math.floor(index)]);
        console.log(index);
        let current_time = (new Date().getTime() / 1000) - startTime;
        if (current_time < 10000 && index < all_trials.length) {
          setTimeout(() => ccpt(index += 0.5),
            hidden ? all_ini[Math.floor(index)] : trial.stimulus_duration);
        }
      }
      start_trial();
    }, 100);
  };

  return plugin;
})();
