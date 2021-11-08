var ccpt = {
  type: 'conjunctive-cpt',
  stimulus_shape: 'squere'
}

// Initiate experiment
var exp_start_time = 0;
var d = new Date();
jsPsych.init({
  timeline: [ccpt],
  fullscreen: true,
  on_finish: function (data) {
    console.log("finish")
  }
});


var start_instructions = {
  type: 'html-keyboard-response',
  stimulus: 'img/orange.png',
  choices: ['f', 'j']
};