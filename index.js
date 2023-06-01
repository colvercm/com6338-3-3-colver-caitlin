/*
Create a "start" button in the HTML that will call
the function you write in this file (It should say "start").

Create a function that will be called
when your button is clicked.

The function should ask the user to agree or disagree
(OK and Cancel respectively) with some statements
using confirm.

Agreeing with a statement should mean the user has a
positive attitude, while disagreeing should
mean a negative attitude.

Ex: "You like movies with happy endings."
Clicking OK means they agree.

Ask the user five questions and count the number
of "agree" responses. (Hint: Use a loop and an array!)
At the end, if the user answered "agree" to
3 or more questions, alert that the user
is an optimist. Otherwise, alert that the user
is a pessimist.

NOTE: Extra alerts, confirms, and prompts
will cause the tests to fail!
*/

function start(personalityQuiz) {

    var questions = [
        "In uncertain times, you expect the best outcome to happen.",
        "You find it easy to relax.",
        "You are optimistic about your future.",
        "You have trust and faith in people.",
        "You aren’t quick to anger.", 
    ]

    var answersTrue = 0;
    for(var i = 0; i < questions.length; i++) {
      var answer = confirm(questions[i])
      if (answer)  {
        answersTrue++
      }
    }

    if (answersTrue >= 3) {
        alert('You are an optimist!')
        } else {
        alert('You are a bit of a pessimist...')
        }
    }