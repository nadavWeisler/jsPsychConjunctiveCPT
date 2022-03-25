/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


 jsPsych.plugins["conjunctive-cpt"] = (function () {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-keyboard-response', 'stimulus', 'image');

  plugin.info = {
    name: 'conjunctive-cpt',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      validationCorrect: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'validation correct',
        default: undefined,
        description: 'The validation to be displayed'
      },
      validationIncorrect: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'validation incorrect',
        default: undefined,
        description: 'The validation to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      validate: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'If validate',
        default: false
      },
      isStimulus: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'If stimulus',
        default: true
      },
      width: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Image width',
        default: "75.6"
      },
      height: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Image height',
        default: "75.6"
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    var new_html = '<img class="cpt-image" src="' + trial.stimulus + '" id="jspsych-image-keyboard-response-stimulus"></img>';

    // add prompt
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }

    if (trial.validate) {
      new_html += '<img class="cpt-image" src="' + trial.validationCorrect + '"id="jspsych-cpt-validation-correct"></img>';
      new_html += '<img class="cpt-image" src="' + trial.validationIncorrect + '"id="jspsych-cpt-validation-incorrect"></img>';
    }


    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null,
    };

    // function to end trial when it is time
    var end_trial = function () {
      if (trial.validate && !response.key && trial.isStimulus) {
        display_element.querySelector("#jspsych-cpt-validation-incorrect").style.visibility = 'visible';
      }
      setTimeout(function () {
        display_element.querySelector("#jspsych-cpt-validation-incorrect").style.visibility = 'hidden'
        setTimeout(function () {

          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

          // kill keyboard listeners
          if (typeof keyboardListener !== 'undefined') {
            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }

          // gather the data to store for the trial
          let trial_data = {
            "rt": response.rt,
            // "stimulus": trial.stimulus,
            "key_press": response.key,
            "is_stimulus": trial.is_stimulus
          };

          // clear the display
          display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        }, 300);
      }, 300);
    };

    // function to handle responses by the subject
    var after_response = function (info) {
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      if (trial.validate) {
        let className = "#jspsych-cpt-validation-correct"
        if (!trial.isStimulus) {
          className = "#jspsych-cpt-validation-incorrect"
        }
        display_element.querySelector(className).style.visibility = 'visible';
        setTimeout(function () {
          display_element.querySelector(className).style.visibility = 'hidden';
        }, 200);
      }

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    if (trial.validate) {
      display_element.querySelector('#jspsych-cpt-validation-correct').style.visibility = 'hidden';
      display_element.querySelector('#jspsych-cpt-validation-incorrect').style.visibility = 'hidden';
    }

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
