var ccpt = {
  type: 'conjunctive-cpt',
  stimulus_shape: 'squere'
}

var blue_trial = {
  type: 'image-keyboard-response',
  stimulus: 'img/blue.png',
  choices: ['f', 'j']
};


// Initiate experiment
var exp_start_time = 0;
var d = new Date();
jsPsych.init({
  timeline: [blue_trial, ccpt],
  fullscreen: true,
  on_finish: function (data) {
    console.log("finish")
  }
});


var orange_trial = {
  type: 'html-keyboard-response',
  stimulus: 'img/orange.png',
  choices: ['f', 'j']
};